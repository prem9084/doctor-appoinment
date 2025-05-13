import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import Appoinment from "../models/Appoinment.js";
import userModel from "../models/UserModel.js";
// API for adding doctor

export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;
    // validation

    if (!name) {
      return res.json({ success: false, message: "Name Missing " });
    }
    if (!email) {
      return res.json({ success: false, message: "email Missing " });
    }
    if (!password) {
      return res.json({ success: false, message: "password Missing " });
    }
    if (!speciality) {
      return res.json({ success: false, message: "Name Missing " });
    }
    if (!degree) {
      return res.json({ success: false, message: "degree Missing " });
    }
    if (!experience) {
      return res.json({ success: false, message: "experience Missing " });
    }
    if (!about) {
      return res.json({ success: false, message: "about Missing " });
    }
    if (!fees) {
      return res.json({ success: false, message: "fees Missing " });
    }
    if (!address) {
      return res.json({ success: false, message: "address Missing " });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please Enter a valid email",
      });
    }

    // validate the password

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter a strong password",
      });
    }

    // hashing password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // upload image to cloudinary

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const docData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = await new doctorModel(docData);

    await newDoctor.save();
    res.json({ success: true, message: "Docter Created" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API FOR THE ADMIN LOGIN

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT);
      return res.json({ message: "Admin LoggedIn", success: true, token });
    } else {
      return res.json({
        success: false,
        message: "Invalid Email and password",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// GET APP DOCTORS

export const GetAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
  }
};

// api to get all appoinments

export const getAppAppoinmentsAdmin = async (req, res) => {
  try {
    const appoinments = await Appoinment.find({});
    res.json({ success: true, appoinments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//  APi For appoinment cancele

export const AdminCancleAppoinment = async (req, res) => {
  try {
    const { appoinmentId } = req.body;

    const appoinmentData = await Appoinment.findById(appoinmentId);
    if (!appoinmentData) {
      return res.json({ success: false, message: "Appointment not found" });
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

// API TO GET DASHBOARD DATA FOR ADMIN PANAL

export const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appoinments = await Appoinment.find({});

    const dashData = {
      doctors: doctors.length,
      appoinments: appoinments.length,
      patients: users.length,
      latestAppoinments: appoinments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
