import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Appoinment from "../models/Appoinment.js";
export const ChangeAvalability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
  }
};

export const doctorsList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-email", "-password"]);
    res.json({ success: true, message: "Doctors fatched", doctors });
  } catch (error) {
    console.log(error);
  }
};

// APi FOR DOCTOR LOGIN

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.send({ success: false, message: "doctor not found" });
    }
    const isMetch = await bcrypt.compare(password, doctor.password);
    if (!isMetch) {
      return res.send({
        success: false,
        message: "Invalid Email and Password",
      });
    }
    if (isMetch) {
      const token = await jwt.sign({ id: doctor._id }, process.env.JWT);
      res.send({
        success: true,
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
        },
        token,
      });
    } else {
      return res.send({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
  }
};

// All Appoinments of the doctor

export const appoinmentsDoctor = async (req, res) => {
  try {
    const docId = req.docId;
    const appoinments = await Appoinment.find({ docId });

    res.json({ success: true, appoinments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Appoinment Completed

export const appoinmentComplete = async (req, res) => {
  try {
    const docId = req.docId;
    const { appoinmentId } = req.body;

    const appoinmentData = await Appoinment.findById(appoinmentId);

    if (appoinmentData && appoinmentData.docId === docId) {
      await Appoinment.findByIdAndUpdate(appoinmentId, { isCompeted: true });
      return res.json({ success: true, message: "Appoinment Completed" });
    } else {
      return res.json({ success: false, message: "Appoinment faild" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// For Cancle

export const appoinmentCancle = async (req, res) => {
  try {
    const docId = req.docId;
    const { appoinmentId } = req.body;

    const appoinmentData = await Appoinment.findById(appoinmentId);

    if (appoinmentData && appoinmentData.docId === docId) {
      await Appoinment.findByIdAndUpdate(appoinmentId, { cancelled: true });
      return res.json({ success: true, message: "Appoinment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation faild" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API TO GET DAHSBOARD DATA FOR DOCTOR DATA

export const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;

    const appoinments = await Appoinment.find({ docId });

    let earnings = 0;

    appoinments.map((item) => {
      if (item.isCompeted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appoinments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appoinments: appoinments.length,
      patients: patients.length,
      latestAppoinments: appoinments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// TO GET THE DOC PROFILE

export const getDocProfile = async (req, res) => {
  try {
    const docId = req.docId;

    const profileData = await doctorModel.findById(docId).select("-password");
    res.send({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// TO UPDATE THE DOC PROFILE

export const updateProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const { fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
    res.send({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
