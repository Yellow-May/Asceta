import { Request, Response } from "express";
import { AccaddApplication } from "../../models/accadd/application.model";
import { getMongoDBStatus } from "../../config/mongodb";
import { uploadToCloudinary } from "../../config/cloudinary";
import multer from "multer";

// Configure multer to store files in memory
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * Submit application form
 * POST /api/accadd/application/submit
 */
export const submitApplication = async (req: Request, res: Response) => {
  try {
    // Check MongoDB connection
    const mongoStatus = getMongoDBStatus();
    if (!mongoStatus.connected) {
      return res.status(503).json({
        error: "Database unavailable",
        message: "MongoDB is not connected. Please try again later.",
      });
    }

    const {
      supabaseUserId,
      email,
      surname,
      middleName,
      firstName,
      sex,
      maritalStatus,
      dateOfBirth,
      stateOfOrigin,
      localGovernmentArea,
      permanentHomeAddress,
      nextOfKin: nextOfKinRaw,
      phone,
    } = req.body;

    // Parse nextOfKin if it's a JSON string (from FormData)
    let nextOfKin;
    if (typeof nextOfKinRaw === "string") {
      try {
        nextOfKin = JSON.parse(nextOfKinRaw);
      } catch (parseError) {
        return res.status(400).json({
          error: "Invalid next of kin data",
          message: "Next of kin information is invalid.",
        });
      }
    } else {
      nextOfKin = nextOfKinRaw;
    }

    // Validate required fields
    if (
      !supabaseUserId ||
      !email ||
      !surname ||
      !firstName ||
      !sex ||
      !maritalStatus ||
      !dateOfBirth ||
      !stateOfOrigin ||
      !localGovernmentArea ||
      !permanentHomeAddress ||
      !nextOfKin ||
      !phone
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "All fields are required.",
      });
    }

    // Validate nextOfKin object
    if (
      !nextOfKin.name ||
      !nextOfKin.relationship ||
      !nextOfKin.phone ||
      !nextOfKin.address
    ) {
      return res.status(400).json({
        error: "Missing next of kin information",
        message: "All next of kin fields are required.",
      });
    }

    // Check if passport photo is uploaded
    if (!req.file) {
      return res.status(400).json({
        error: "Missing passport photo",
        message: "Passport photo is required.",
      });
    }

    // Upload passport photo to Cloudinary
    let passportPhoto;
    try {
      const uploadResult = await uploadToCloudinary(
        req.file,
        "accadd-applications/passports"
      );
      passportPhoto = {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
      };
    } catch (uploadError: any) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({
        error: "File upload failed",
        message: "Failed to upload passport photo. Please try again.",
      });
    }

    // Check if application already exists
    const existingApplication = await AccaddApplication.findOne({
      $or: [{ email: email.toLowerCase() }, { supabaseUserId }],
    });

    if (existingApplication) {
      // Update existing application
      existingApplication.surname = surname;
      existingApplication.middleName = middleName || "";
      existingApplication.firstName = firstName;
      existingApplication.sex = sex;
      existingApplication.maritalStatus = maritalStatus;
      existingApplication.dateOfBirth = new Date(dateOfBirth);
      existingApplication.stateOfOrigin = stateOfOrigin;
      existingApplication.localGovernmentArea = localGovernmentArea;
      existingApplication.permanentHomeAddress = permanentHomeAddress;
      existingApplication.nextOfKin = nextOfKin;
      existingApplication.phone = phone;
      existingApplication.passportPhoto = passportPhoto;
      existingApplication.status = "submitted";
      existingApplication.submittedAt = new Date();

      await existingApplication.save();

      return res.status(200).json({
        message: "Application updated successfully",
        application: {
          id: existingApplication._id,
          status: existingApplication.status,
          submittedAt: existingApplication.submittedAt,
        },
      });
    }

    // Create new application
    const newApplication = new AccaddApplication({
      supabaseUserId,
      email: email.toLowerCase(),
      surname,
      middleName: middleName || "",
      firstName,
      sex,
      maritalStatus,
      dateOfBirth: new Date(dateOfBirth),
      stateOfOrigin,
      localGovernmentArea,
      permanentHomeAddress,
      nextOfKin,
      phone,
      passportPhoto,
      status: "submitted",
      submittedAt: new Date(),
    });

    await newApplication.save();

    return res.status(201).json({
      message: "Application submitted successfully",
      application: {
        id: newApplication._id,
        status: newApplication.status,
        submittedAt: newApplication.submittedAt,
      },
    });
  } catch (error: any) {
    console.error("Error in submitApplication controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while submitting the application.",
    });
  }
};

/**
 * Get application by user ID
 * GET /api/accadd/application/:supabaseUserId
 */
export const getApplication = async (req: Request, res: Response) => {
  try {
    const mongoStatus = getMongoDBStatus();
    if (!mongoStatus.connected) {
      return res.status(503).json({
        error: "Database unavailable",
        message: "MongoDB is not connected. Please try again later.",
      });
    }

    const { supabaseUserId } = req.params;

    if (!supabaseUserId) {
      return res.status(400).json({
        error: "Missing required parameter",
        message: "User ID is required.",
      });
    }

    const application = await AccaddApplication.findOne({ supabaseUserId });

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
        message: "No application found for this user.",
      });
    }

    return res.status(200).json({
      application: {
        id: application._id,
        surname: application.surname,
        middleName: application.middleName,
        firstName: application.firstName,
        sex: application.sex,
        maritalStatus: application.maritalStatus,
        dateOfBirth: application.dateOfBirth,
        stateOfOrigin: application.stateOfOrigin,
        localGovernmentArea: application.localGovernmentArea,
        permanentHomeAddress: application.permanentHomeAddress,
        nextOfKin: application.nextOfKin,
        phone: application.phone,
        email: application.email,
        passportPhoto: application.passportPhoto,
        status: application.status,
        submittedAt: application.submittedAt,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error in getApplication controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while retrieving the application.",
    });
  }
};
