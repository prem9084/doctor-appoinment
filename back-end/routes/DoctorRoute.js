import express from "express";

import {
  appoinmentCancle,
  appoinmentComplete,
  appoinmentsDoctor,
  doctorDashboard,
  doctorsList,
  getDocProfile,
  loginDoctor,
  updateProfile,
} from "../controllers/DoctoreController.js";
import authDoctor from "../middleware/Auth-Doctor.js";

const router = express.Router();

router.get("/list", doctorsList);
router.post("/login", loginDoctor);
router.get("/doc-appoinment", authDoctor, appoinmentsDoctor);
router.post("/completed", authDoctor, appoinmentComplete);
router.post("/cancelled", authDoctor, appoinmentCancle);
router.get("/dashboard", authDoctor, doctorDashboard);
router.get("/profile", authDoctor, getDocProfile);
router.post("/update-profile", authDoctor, updateProfile);
export default router;
