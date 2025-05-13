import express from "express";
import upload from "../middleware/multer.js";
import {
  BookAppoinment,
  cancleAppoinment,
  getAppoinment,
  getUserProfile,
  LoginUser,
  ProfileUpdate,
  RazorPayPayemnt,
  registerUser,
  verifyRazorPay,
} from "../controllers/UserController.js";
import authUser from "../middleware/AuthUser.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/get-profile", authUser, getUserProfile);
router.post("/update-profile", upload.single("image"), authUser, ProfileUpdate);

router.post("/book-appoinment", authUser, BookAppoinment);
router.get("/get-appoinment", authUser, getAppoinment);
router.post("/cancle-appoinment", authUser, cancleAppoinment);

router.post("/payment", authUser, RazorPayPayemnt);
router.post("/verify-payment", authUser, verifyRazorPay);
export default router;
