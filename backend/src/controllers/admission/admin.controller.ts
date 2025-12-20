import { Request, Response } from "express";
import { AdmissionUser } from "../../models/admission/user.model";
import { AdmissionApplication } from "../../models/admission/application.model";
import { AdmissionPayment } from "../../models/admission/payment.model";
import { AdmissionDocument } from "../../models/admission/document.model";
import { getMongoDBStatus } from "../../config/mongodb";

/**
 * Get all admission applications
 * GET /api/admission-portal/admin/applications
 */
export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const mongoStatus = getMongoDBStatus();
    if (!mongoStatus.connected) {
      return res.status(503).json({
        error: "Database unavailable",
        message: "MongoDB is not connected. Please try again later.",
      });
    }

    const users = await AdmissionUser.find().sort({ createdAt: -1 });

    const applicationsData = await Promise.all(
      users.map(async (user) => {
        const application = await AdmissionApplication.findOne({
          supabaseUserId: user.supabaseUserId,
        });

        const payments = await AdmissionPayment.find({
          supabaseUserId: user.supabaseUserId,
        });

        const latestPayment = payments.length > 0 ? payments[0] : null;

        return {
          id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          supabaseUserId: user.supabaseUserId,
          isEmailVerified: user.isEmailVerified,
          stage: application
            ? application.status === "submitted"
              ? "application_submitted"
              : application.status === "under_review"
              ? "under_review"
              : application.status === "admitted"
              ? "approved"
              : application.status === "rejected"
              ? "rejected"
              : "registered"
            : "registered",
          hasApplication: !!application,
          applicationStatus: application?.status || null,
          applicationSubmittedAt: application?.submittedAt || null,
          paymentStatus: latestPayment?.status || "not_initiated",
          paymentAmount: latestPayment?.amount || 0,
          paymentCreatedAt: latestPayment?.createdAt || null,
          createdAt: user.createdAt,
        };
      })
    );

    return res.status(200).json({
      applications: applicationsData,
    });
  } catch (error: any) {
    console.error("Error in getAllApplications controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while retrieving applications.",
    });
  }
};

/**
 * Get application details by user ID
 * GET /api/admission-portal/admin/applications/:supabaseUserId
 */
export const getApplicationDetails = async (req: Request, res: Response) => {
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

    const user = await AdmissionUser.findOne({ supabaseUserId });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "No user found with this ID.",
      });
    }

    const application = await AdmissionApplication.findOne({ supabaseUserId });
    const payments = await AdmissionPayment.find({ supabaseUserId }).sort({
      createdAt: -1,
    });
    const documents = await AdmissionDocument.find({ supabaseUserId });

    const stage = application
      ? application.status === "submitted"
        ? "application_submitted"
        : application.status === "under_review"
        ? "under_review"
        : application.status === "admitted"
        ? "approved"
        : application.status === "rejected"
        ? "rejected"
        : "registered"
      : "registered";

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        supabaseUserId: user.supabaseUserId,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      stage,
      application: application ? application.toObject() : null,
      payments: payments.map((p) => p.toObject()),
      documents: documents.map((d) => d.toObject()),
    });
  } catch (error: any) {
    console.error("Error in getApplicationDetails controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while retrieving application details.",
    });
  }
};

/**
 * Update application status
 * PUT /api/admission-portal/admin/applications/:id/status
 */
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const mongoStatus = getMongoDBStatus();
    if (!mongoStatus.connected) {
      return res.status(503).json({
        error: "Database unavailable",
        message: "MongoDB is not connected. Please try again later.",
      });
    }

    const { id } = req.params;
    const { status, assignedCourse, reviewNotes, reviewedBy } = req.body;

    if (!status) {
      return res.status(400).json({
        error: "Missing required field",
        message: "Status is required.",
      });
    }

    const validStatuses = [
      "pending",
      "submitted",
      "under_review",
      "admitted",
      "rejected",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const application = await AdmissionApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        error: "Application not found",
        message: "No application found with this ID.",
      });
    }

    application.status = status as any;
    application.reviewedAt = new Date();
    if (reviewedBy) {
      application.reviewedBy = reviewedBy;
    }
    if (reviewNotes) {
      application.reviewNotes = reviewNotes;
    }
    if (assignedCourse) {
      application.assignedCourse = assignedCourse;
    }

    await application.save();

    return res.status(200).json({
      message: "Application status updated successfully",
      application: {
        id: application._id,
        status: application.status,
        assignedCourse: application.assignedCourse,
        reviewedAt: application.reviewedAt,
        reviewedBy: application.reviewedBy,
        reviewNotes: application.reviewNotes,
      },
    });
  } catch (error: any) {
    console.error("Error in updateApplicationStatus controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while updating application status.",
    });
  }
};

/**
 * Get dashboard statistics
 * GET /api/admission-portal/admin/stats
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    const mongoStatus = getMongoDBStatus();
    if (!mongoStatus.connected) {
      return res.status(503).json({
        error: "Database unavailable",
        message: "MongoDB is not connected. Please try again later.",
      });
    }

    const totalUsers = await AdmissionUser.countDocuments();
    const totalApplications = await AdmissionApplication.countDocuments();
    const pendingApplications = await AdmissionApplication.countDocuments({
      status: "pending",
    });
    const submittedApplications = await AdmissionApplication.countDocuments({
      status: "submitted",
    });
    const underReviewApplications = await AdmissionApplication.countDocuments({
      status: "under_review",
    });
    const admittedApplications = await AdmissionApplication.countDocuments({
      status: "admitted",
    });
    const rejectedApplications = await AdmissionApplication.countDocuments({
      status: "rejected",
    });
    const totalPayments = await AdmissionPayment.countDocuments();
    const completedPayments = await AdmissionPayment.countDocuments({
      status: "completed",
    });

    return res.status(200).json({
      stats: {
        totalUsers,
        totalApplications,
        pendingApplications,
        submittedApplications,
        underReviewApplications,
        admittedApplications,
        rejectedApplications,
        totalPayments,
        completedPayments,
      },
    });
  } catch (error: any) {
    console.error("Error in getStats controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while retrieving statistics.",
    });
  }
};
