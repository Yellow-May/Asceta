import { Router, RequestHandler } from "express";
import {
  register,
  getAuthStatus,
} from "../controllers/admission/auth.controller";
import {
  initiatePayment,
  getPaymentStatus,
} from "../controllers/admission/payment.controller";
import {
  submitApplication,
  getApplication,
  upload,
  uploadDocument,
} from "../controllers/admission/application.controller";
import {
  getAllApplications,
  getApplicationDetails,
  updateApplicationStatus,
  getStats,
} from "../controllers/admission/admin.controller";

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
router.post(
  "/application/upload-document",
  upload.single("file") as unknown as RequestHandler,
  uploadDocument
);

// Admin routes
router.get("/admin/applications", getAllApplications);
router.get("/admin/applications/:supabaseUserId", getApplicationDetails);
router.put("/admin/applications/:id/status", updateApplicationStatus);
router.get("/admin/stats", getStats);

export default router;
