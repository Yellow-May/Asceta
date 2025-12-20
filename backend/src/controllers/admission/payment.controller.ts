import { Request, Response } from "express";
import { AdmissionPayment } from "../../models/admission/payment.model";
import { getMongoDBStatus } from "../../config/mongodb";

/**
 * Initiate payment
 * POST /api/admission-portal/payment/initiate
 */
export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const mongoStatus = getMongoDBStatus();
    if (!mongoStatus.connected) {
      return res.status(503).json({
        error: "Database unavailable",
        message: "MongoDB is not connected. Please try again later.",
      });
    }

    const { email, supabaseUserId, paymentType, amount, paymentData } =
      req.body;

    if (!email || !supabaseUserId || !paymentType || !amount) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "email, supabaseUserId, paymentType, and amount are required.",
      });
    }

    const payment = new AdmissionPayment({
      email: email.toLowerCase(),
      supabaseUserId,
      paymentType,
      amount,
      status: "pending",
      paymentData: paymentData || {},
    });

    await payment.save();

    return res.status(201).json({
      message: "Payment initiated successfully",
      payment: {
        id: payment._id,
        paymentType: payment.paymentType,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error in initiatePayment controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while initiating payment.",
    });
  }
};

/**
 * Get payment status by email
 * GET /api/admission-portal/payment/status/:email
 */
export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const mongoStatus = getMongoDBStatus();
    if (!mongoStatus.connected) {
      return res.status(503).json({
        error: "Database unavailable",
        message: "MongoDB is not connected. Please try again later.",
      });
    }

    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        error: "Missing required parameter",
        message: "Email is required.",
      });
    }

    const payments = await AdmissionPayment.find({
      email: email.toLowerCase(),
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      payments: payments.map((payment) => ({
        id: payment._id,
        paymentType: payment.paymentType,
        status: payment.status,
        amount: payment.amount,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error("Error in getPaymentStatus controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while retrieving payment status.",
    });
  }
};
