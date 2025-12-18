import { Request, Response } from "express";
import { AccaddUser } from "../../models/accadd/user.model";
import { AccaddApplication } from "../../models/accadd/application.model";
import { AccaddPayment } from "../../models/accadd/payment.model";
import { getMongoDBStatus } from "../../config/mongodb";

/**
 * Get all ACCADD users with their application and payment status
 * GET /api/accadd/admin/users
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const mongoStatus = getMongoDBStatus();
    if (!mongoStatus.connected) {
      return res.status(503).json({
        error: "Database unavailable",
        message: "MongoDB is not connected. Please try again later.",
      });
    }

    // Get all users
    const users = await AccaddUser.find().sort({ createdAt: -1 });

    // Get all applications and payments
    const applications = await AccaddApplication.find();
    const payments = await AccaddPayment.find();

    // Create maps for quick lookup
    const applicationMap = new Map();
    applications.forEach((app) => {
      applicationMap.set(app.supabaseUserId, app);
    });

    const paymentMap = new Map();
    payments.forEach((payment) => {
      if (!paymentMap.has(payment.supabaseUserId)) {
        paymentMap.set(payment.supabaseUserId, []);
      }
      paymentMap.get(payment.supabaseUserId).push(payment);
    });

    // Combine data
    const usersWithStatus = users.map((user) => {
      const application = applicationMap.get(user.supabaseUserId);
      const userPayments = paymentMap.get(user.supabaseUserId) || [];

      // Determine stage
      let stage = "registered";
      if (application) {
        if (application.status === "submitted") {
          stage = "application_submitted";
        } else if (application.status === "under_review") {
          stage = "under_review";
        } else if (application.status === "approved") {
          stage = "approved";
        } else if (application.status === "rejected") {
          stage = "rejected";
        }
      }

      // Get latest payment status
      const latestPayment =
        userPayments.length > 0
          ? userPayments.sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0]
          : null;

      return {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        supabaseUserId: user.supabaseUserId,
        isEmailVerified: user.isEmailVerified,
        stage,
        hasApplication: !!application,
        applicationStatus: application?.status || null,
        applicationSubmittedAt: application?.submittedAt || null,
        paymentStatus: latestPayment?.status || "not_initiated",
        paymentAmount: latestPayment?.amount || 0,
        paymentCreatedAt: latestPayment?.createdAt || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    return res.status(200).json({
      users: usersWithStatus,
      total: usersWithStatus.length,
    });
  } catch (error: any) {
    console.error("Error in getAllUsers controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while retrieving users.",
    });
  }
};

/**
 * Get detailed information for a specific user
 * GET /api/accadd/admin/users/:supabaseUserId
 */
export const getUserDetails = async (req: Request, res: Response) => {
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

    // Get user
    const user = await AccaddUser.findOne({ supabaseUserId });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "No user found with this ID.",
      });
    }

    // Get application
    const application = await AccaddApplication.findOne({ supabaseUserId });

    // Get payments
    const payments = await AccaddPayment.find({ supabaseUserId }).sort({
      createdAt: -1,
    });

    // Determine stage
    let stage = "registered";
    if (application) {
      if (application.status === "submitted") {
        stage = "application_submitted";
      } else if (application.status === "under_review") {
        stage = "under_review";
      } else if (application.status === "approved") {
        stage = "approved";
      } else if (application.status === "rejected") {
        stage = "rejected";
      }
    }

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
      application: application
        ? {
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
            passportPhoto: application.passportPhoto,
            status: application.status,
            submittedAt: application.submittedAt,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
          }
        : null,
      payments: payments.map((payment) => ({
        id: payment._id,
        status: payment.status,
        amount: payment.amount,
        paymentData: payment.paymentData,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error("Error in getUserDetails controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while retrieving user details.",
    });
  }
};

/**
 * Get ACCADD statistics
 * GET /api/accadd/admin/stats
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

    const [totalUsers, totalApplications, totalPayments] = await Promise.all([
      AccaddUser.countDocuments(),
      AccaddApplication.countDocuments(),
      AccaddPayment.countDocuments(),
    ]);

    const applicationsByStatus = await AccaddApplication.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const paymentsByStatus = await AccaddPayment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const applicationsStatusMap: Record<string, number> = {};
    applicationsByStatus.forEach((item) => {
      applicationsStatusMap[item._id] = item.count;
    });

    const paymentsStatusMap: Record<string, number> = {};
    paymentsByStatus.forEach((item) => {
      paymentsStatusMap[item._id] = item.count;
    });

    return res.status(200).json({
      totalUsers,
      totalApplications,
      totalPayments,
      applicationsByStatus: applicationsStatusMap,
      paymentsByStatus: paymentsStatusMap,
    });
  } catch (error: any) {
    console.error("Error in getStats controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while retrieving statistics.",
    });
  }
};
