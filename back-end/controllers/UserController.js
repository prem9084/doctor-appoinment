import validator from "validator";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import Appoinment from "../models/Appoinment.js";
import razorpay from "razorpay";
// API TO REGISTER USER

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.json({ success: false, message: "Name is required" });
    }

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    if (!password) {
      return res.json({ success: false, message: "Password is required" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password should not be lassthen 8 charactor",
      });
    }

    const existngUser = await UserModel.findOne({ email });

    if (existngUser) {
      return res.json({ success: false, message: "User Already register" });
    }

    // Hass password

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const user = { name, email, password: hashPassword };

    const newUser = await new UserModel(user);

    await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "7d",
    });

    res.json({ success: true, message: "User Created", newUser, token });
  } catch (error) {
    console.log(error);
  }
};

// LOGIn USER

export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User is register" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email and Password",
      });
    }

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT, {
        expiresIn: "7d",
      });
      res.json({
        success: true,
        message: "User loggedIn",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// PROFILE DATA

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // injected by authUser middleware

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// UPDATE PROFILE

export const ProfileUpdate = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    await UserModel.findByIdAndUpdate(req.userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await UserModel.findByIdAndUpdate(req.userId, { image: imageUrl });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
  }
};

// BOOK APPOINMMENET

export const BookAppoinment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId; // ✅ pulled from middleware

    const userData = await UserModel.findById(userId).select("-password");
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData?.available) {
      return res.json({ success: false, message: "Doctor is not available" });
    }

    // Book the slot
    let slots_booked = docData.slots_booked || {};
    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }
    if (slots_booked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: "Slot not available" });
    }
    slots_booked[slotDate].push(slotTime);

    // Clean up unnecessary data
    delete docData.slots_booked;

    const appoinmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppoinment = new Appoinment(appoinmentData);
    await newAppoinment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// APi TO GET APPOINMENT

export const getAppoinment = async (req, res) => {
  try {
    const { userId } = req.userId;

    const appoinment = await Appoinment.find(userId);

    res.json({ success: true, appoinment });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Cancle Appoinment

export const cancleAppoinment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appoinmentId } = req.body;

    const appoinmentData = await Appoinment.findById(appoinmentId);
    if (!appoinmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appoinmentData.userId !== userId) {
      return res.json({ success: false, message: "User not authorized" });
    }

    await Appoinment.findByIdAndUpdate(appoinmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appoinmentData;

    const doctorData = await doctorModel.findById(docId);
    if (doctorData?.slots_booked?.[slotDate]) {
      doctorData.slots_booked[slotDate] = doctorData.slots_booked[
        slotDate
      ].filter((e) => e !== slotTime);
      await doctorModel.findByIdAndUpdate(docId, {
        slots_booked: doctorData.slots_booked,
      });
    }

    res.json({ success: true, message: "Appointment has been cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Online Pyament
const razorpayInstance = new razorpay({
  key_id: "rzp_test_CuW3VSbQWSUDVJ",
  key_secret: "v1AN0UaEB75e2r7Oc0yepxab",
});

export const RazorPayPayemnt = async (req, res) => {
  try {
    const { appoinmentId } = req.body;

    const appoinmentData = await Appoinment.findById(appoinmentId);

    if (!appoinmentData || appoinmentData.cancelled || !appoinmentData.amount) {
      return res.json({
        success: false,
        message: "Appointment not found, cancelled, or missing amount",
      });
    }

    const options = {
      amount: appoinmentData.amount * 100, // in paisa
      currency: "INR",
      receipt: appoinmentId,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, message: "Order created", order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify payment

export const verifyRazorPay = async (req, res) => {
  try {
    const { receipt } = req.body;

    const orderInfo = await Appoinment.findByIdAndUpdate(receipt, {
      payment: true,
    });

    if (orderInfo.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment completed",
      });
    } else {
      return res.json({
        success: false,
        message: "Payment is faild",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
