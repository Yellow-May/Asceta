import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { AppDataSource } from "../config/data-source";
import { User, UserRole } from "../entities/User";
import { body, validationResult } from "express-validator";

export const applyForAdmission = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("firstName").trim().notEmpty(),
  body("lastName").trim().notEmpty(),
  body("examType").isIn(["jamb", "waec"]),
  body("jambRegNo").if(body("examType").equals("jamb")).notEmpty(),
  body("waecRegNo").if(body("examType").equals("waec")).notEmpty(),
  body("waecExamDate").if(body("examType").equals("waec")).notEmpty().isISO8601(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const {
        email,
        password,
        firstName,
        lastName,
        examType,
        jambRegNo,
        waecRegNo,
        waecExamDate,
      } = req.body;

      const userRepository = AppDataSource.getRepository(User);

      // Check if user already exists
      const existingUser = await userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({ message: "User with this email already exists" });
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user with admission data
      const user = userRepository.create({
        email,
        passwordHash,
        firstName,
        lastName,
        role: UserRole.STUDENT,
        jambRegNo: examType === "jamb" ? jambRegNo : null,
        waecRegNo: examType === "waec" ? waecRegNo : null,
        waecExamDate: examType === "waec" ? new Date(waecExamDate) : null,
      });

      await userRepository.save(user);

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET || "secret";
      const jwtExpiry: StringValue = (process.env.JWT_EXPIRES_IN ||
        "7d") as StringValue;

      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: jwtExpiry,
      });

      res.status(201).json({
        message: "Admission application submitted successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Admission application error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
