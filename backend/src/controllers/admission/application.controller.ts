import { Request, Response } from "express";
import { AdmissionApplication } from "../../models/admission/application.model";
import { AdmissionDocument } from "../../models/admission/document.model";
import { getMongoDBStatus } from "../../config/mongodb";
import { uploadToCloudinary } from "../../config/cloudinary";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and PDF files are allowed"));
    }
  },
});

/**
 * Submit application form
 * POST /api/admission-portal/application/submit
 */
export const submitApplication = async (req: Request, res: Response) => {
  try {
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
      dateOfBirth,
      phone,
      stateOfOrigin,
      localGovernmentArea,
      permanentHomeAddress,
      jambScore,
      jambRegNo,
      oLevelFirstSitting,
      oLevelSecondSitting,
      firstChoice,
      secondChoice,
      nextOfKin: nextOfKinRaw,
    } = req.body;

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

    let oLevelFirst, oLevelSecond;
    if (typeof oLevelFirstSitting === "string") {
      try {
        oLevelFirst = JSON.parse(oLevelFirstSitting);
      } catch (e) {
        return res.status(400).json({
          error: "Invalid O'Level first sitting data",
        });
      }
    } else {
      oLevelFirst = oLevelFirstSitting;
    }

    if (oLevelSecondSitting) {
      if (typeof oLevelSecondSitting === "string") {
        try {
          oLevelSecond = JSON.parse(oLevelSecondSitting);
        } catch (e) {
          return res.status(400).json({
            error: "Invalid O'Level second sitting data",
          });
        }
      } else {
        oLevelSecond = oLevelSecondSitting;
      }
    }

    let firstChoiceParsed, secondChoiceParsed;
    if (typeof firstChoice === "string") {
      try {
        firstChoiceParsed = JSON.parse(firstChoice);
      } catch (e) {
        return res.status(400).json({ error: "Invalid first choice data" });
      }
    } else {
      firstChoiceParsed = firstChoice;
    }

    if (secondChoice) {
      if (typeof secondChoice === "string") {
        try {
          secondChoiceParsed = JSON.parse(secondChoice);
        } catch (e) {
          return res.status(400).json({ error: "Invalid second choice data" });
        }
      } else {
        secondChoiceParsed = secondChoice;
      }
    }

    if (
      !supabaseUserId ||
      !email ||
      !surname ||
      !firstName ||
      !sex ||
      !dateOfBirth ||
      !phone ||
      !stateOfOrigin ||
      !localGovernmentArea ||
      !permanentHomeAddress ||
      !oLevelFirst ||
      !firstChoiceParsed ||
      !nextOfKin
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "All required fields must be provided.",
      });
    }

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

    if (!req.file) {
      return res.status(400).json({
        error: "Missing passport photo",
        message: "Passport photo is required.",
      });
    }

    let passportPhoto;
    try {
      const uploadResult = await uploadToCloudinary(
        req.file,
        "admission-applications/passports"
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

    const existingApplication = await AdmissionApplication.findOne({
      $or: [{ email: email.toLowerCase() }, { supabaseUserId }],
    });

    if (existingApplication) {
      existingApplication.surname = surname;
      existingApplication.middleName = middleName || "";
      existingApplication.firstName = firstName;
      existingApplication.sex = sex;
      existingApplication.dateOfBirth = new Date(dateOfBirth);
      existingApplication.phone = phone;
      existingApplication.stateOfOrigin = stateOfOrigin;
      existingApplication.localGovernmentArea = localGovernmentArea;
      existingApplication.permanentHomeAddress = permanentHomeAddress;
      existingApplication.jambScore = jambScore || undefined;
      existingApplication.jambRegNo = jambRegNo || undefined;
      existingApplication.oLevelFirstSitting = oLevelFirst;
      existingApplication.oLevelSecondSitting = oLevelSecond || undefined;
      existingApplication.firstChoice = firstChoiceParsed;
      existingApplication.secondChoice = secondChoiceParsed || undefined;
      existingApplication.nextOfKin = nextOfKin;
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

    const newApplication = new AdmissionApplication({
      supabaseUserId,
      email: email.toLowerCase(),
      surname,
      middleName: middleName || "",
      firstName,
      sex,
      dateOfBirth: new Date(dateOfBirth),
      phone,
      stateOfOrigin,
      localGovernmentArea,
      permanentHomeAddress,
      jambScore: jambScore || undefined,
      jambRegNo: jambRegNo || undefined,
      oLevelFirstSitting: oLevelFirst,
      oLevelSecondSitting: oLevelSecond || undefined,
      firstChoice: firstChoiceParsed,
      secondChoice: secondChoiceParsed || undefined,
      nextOfKin,
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
 * GET /api/admission-portal/application/:supabaseUserId
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

    const application = await AdmissionApplication.findOne({ supabaseUserId });

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
        message: "No application found for this user.",
      });
    }

    return res.status(200).json({
      application: {
        id: application._id,
        ...application.toObject(),
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

/**
 * Upload document
 * POST /api/admission-portal/application/upload-document
 */
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const mongoStatus = getMongoDBStatus();
    if (!mongoStatus.connected) {
      return res.status(503).json({
        error: "Database unavailable",
        message: "MongoDB is not connected. Please try again later.",
      });
    }

    const { supabaseUserId, email, documentType } = req.body;

    if (!supabaseUserId || !email || !documentType) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "supabaseUserId, email, and documentType are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Missing file",
        message: "File is required.",
      });
    }

    let fileUpload;
    try {
      const uploadResult = await uploadToCloudinary(
        req.file,
        `admission-applications/documents/${documentType}`
      );
      fileUpload = {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
        originalName: req.file.originalname,
      };
    } catch (uploadError: any) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({
        error: "File upload failed",
        message: "Failed to upload document. Please try again.",
      });
    }

    const existingDocument = await AdmissionDocument.findOne({
      supabaseUserId,
      documentType,
    });

    if (existingDocument) {
      existingDocument.file = fileUpload;
      existingDocument.uploadedAt = new Date();
      await existingDocument.save();

      return res.status(200).json({
        message: "Document updated successfully",
        document: {
          id: existingDocument._id,
          documentType: existingDocument.documentType,
          file: existingDocument.file,
          uploadedAt: existingDocument.uploadedAt,
        },
      });
    }

    const newDocument = new AdmissionDocument({
      supabaseUserId,
      email: email.toLowerCase(),
      documentType,
      file: fileUpload,
      uploadedAt: new Date(),
    });

    await newDocument.save();

    return res.status(201).json({
      message: "Document uploaded successfully",
      document: {
        id: newDocument._id,
        documentType: newDocument.documentType,
        file: newDocument.file,
        uploadedAt: newDocument.uploadedAt,
      },
    });
  } catch (error: any) {
    console.error("Error in uploadDocument controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while uploading the document.",
    });
  }
};
