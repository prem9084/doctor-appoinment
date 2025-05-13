import express from "express";
import {
  addDoctor,
  AdminCancleAppoinment,
  adminDashboard,
  GetAllDoctors,
  getAppAppoinmentsAdmin,
  loginAdmin,
} from "../controllers/AdminController.js";
import upload from "../middleware/multer.js";

import authAdmin from "../middleware/Auth-Admin.js";
import { ChangeAvalability } from "../controllers/DoctoreController.js";

const router = express.Router();

router.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
router.post("/login-admin", loginAdmin);
router.post("/all-doctors", authAdmin, GetAllDoctors);
router.post("/change-availability", authAdmin, ChangeAvalability);

router.get("/appoinments", authAdmin, getAppAppoinmentsAdmin);
router.post("/admin-cancle-appoinment", authAdmin, AdminCancleAppoinment);
router.get("/admin-dash", authAdmin, adminDashboard);
export default router;
