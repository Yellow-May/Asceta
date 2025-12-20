import { Request, Response } from "express";
import { AdmissionUser } from "../../models/admission/user.model";
import { getMongoDBStatus } from "../../config/mongodb";

/**
 * Register a new Admission user after Supabase authentication
 * POST /api/admission-portal/auth/register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const mongoStatus = getMongoDBStatus();
    if (!mongoStatus.connected) {
      return res.status(503).json({
        error: "Database unavailable",
        message: "MongoDB is not connected. Please try again later.",
      });
    }

    const { supabaseUserId, email, fullName } = req.body;

    if (!supabaseUserId || !email) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "supabaseUserId and email are required.",
      });
    }

    const userFullName = fullName || email.split("@")[0] || "User";

    const existingUser = await AdmissionUser.findOne({
      $or: [{ email: email.toLowerCase() }, { supabaseUserId }],
    });

    if (existingUser) {
      return res.status(200).json({
        message: "User already registered",
        user: {
          id: existingUser._id,
          email: existingUser.email,
          fullName: existingUser.fullName,
          supabaseUserId: existingUser.supabaseUserId,
          isEmailVerified: existingUser.isEmailVerified,
          createdAt: existingUser.createdAt,
        },
      });
    }

    const newUser = new AdmissionUser({
      email: email.toLowerCase(),
      fullName: userFullName,
      supabaseUserId,
      isEmailVerified: true,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        supabaseUserId: newUser.supabaseUserId,
        isEmailVerified: newUser.isEmailVerified,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in admission register controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while registering the user.",
    });
  }
};

/**
 * Get user auth status by email
 * GET /api/admission-portal/auth/status/:email
 */
export const getAuthStatus = async (req: Request, res: Response) => {
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

    const user = await AdmissionUser.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "No user found with this email.",
      });
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
    });
  } catch (error) {
    console.error("Error in admission getAuthStatus controller:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred while retrieving user status.",
    });
  }
};
