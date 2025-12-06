import { Request, Response } from 'express';
import { AccaddPayment } from '../../models/accadd/payment.model';
import { getMongoDBStatus } from '../../config/mongodb';

/**
 * Initiate a payment record (non-functional, just tracking)
 * POST /api/accadd/payment/initiate
 */
export const initiatePayment = async (req: Request, res: Response) => {
  try {
    // Check MongoDB connection
    const mongoStatus = getMongoDBStatus();
    if (!mongoStatus.connected) {
      return res.status(503).json({
        error: 'Database unavailable',
        message: 'MongoDB is not connected. Please try again later.',
      });
    }

    const { email, supabaseUserId, status, amount, paymentData } = req.body;

    // Validate required fields
    if (!email || !supabaseUserId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'email and supabaseUserId are required.',
      });
    }

    // Check if payment already exists for this user
    const existingPayment = await AccaddPayment.findOne({
      supabaseUserId,
      status: { $in: ['pending', 'completed'] },
    });

    if (existingPayment) {
      return res.status(200).json({
        message: 'Payment record already exists',
        payment: {
          id: existingPayment._id,
          email: existingPayment.email,
          supabaseUserId: existingPayment.supabaseUserId,
          status: existingPayment.status,
          amount: existingPayment.amount,
          createdAt: existingPayment.createdAt,
          updatedAt: existingPayment.updatedAt,
        },
      });
    }

    // Create new payment record
    const newPayment = new AccaddPayment({
      email: email.toLowerCase(),
      supabaseUserId,
      status: status || 'pending',
      amount: amount || 0,
      paymentData: paymentData || {},
    });

    await newPayment.save();

    return res.status(201).json({
      message: 'Payment record created successfully',
      payment: {
        id: newPayment._id,
        email: newPayment.email,
        supabaseUserId: newPayment.supabaseUserId,
        status: newPayment.status,
        amount: newPayment.amount,
        createdAt: newPayment.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in initiatePayment controller:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while creating payment record.',
    });
  }
};

/**
 * Get payment status by email
 * GET /api/accadd/payment/status/:email
 */
export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    // Check MongoDB connection
    const mongoStatus = getMongoDBStatus();
    if (!mongoStatus.connected) {
      return res.status(503).json({
        error: 'Database unavailable',
        message: 'MongoDB is not connected. Please try again later.',
      });
    }

    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'Email is required.',
      });
    }

    // Find all payments for this email (sorted by most recent first)
    const payments = await AccaddPayment.find({
      email: email.toLowerCase(),
    }).sort({ createdAt: -1 });

    if (!payments || payments.length === 0) {
      return res.status(404).json({
        error: 'Payment not found',
        message: 'No payment records found for this email.',
      });
    }

    return res.status(200).json({
      payments: payments.map((payment) => ({
        id: payment._id,
        email: payment.email,
        supabaseUserId: payment.supabaseUserId,
        status: payment.status,
        amount: payment.amount,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error in getPaymentStatus controller:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while retrieving payment status.',
    });
  }
};

