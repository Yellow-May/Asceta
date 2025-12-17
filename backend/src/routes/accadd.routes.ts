import { Router, RequestHandler } from "express";
import { register, getAuthStatus } from "../controllers/accadd/auth.controller";
import {
  initiatePayment,
  getPaymentStatus,
} from "../controllers/accadd/payment.controller";
import {
  submitApplication,
  getApplication,
  upload,
} from "../controllers/accadd/application.controller";
import {
  getAllUsers,
  getUserDetails,
  getStats,
} from "../controllers/accadd/admin.controller";

const router = Router();

// Auth routes
router.post("/auth/register", register);
router.get("/auth/status/:email", getAuthStatus);

// Payment routes
router.post("/payment/initiate", initiatePayment);
router.get("/payment/status/:email", getPaymentStatus);

// Application routes
router.post(
  "/application/submit",
  upload.single("passportPhoto") as unknown as RequestHandler,
  submitApplication
);
router.get("/application/:supabaseUserId", getApplication);

// Admin routes
router.get("/admin/users", getAllUsers);
router.get("/admin/users/:supabaseUserId", getUserDetails);
router.get("/admin/stats", getStats);

export default router;
