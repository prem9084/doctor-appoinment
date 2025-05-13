import mongoose from "mongoose";

const appoinmentScheema = new mongoose.Schema({
  userId: { type: String },
  docId: { type: String },
  slotDate: { type: String },
  slotTime: { type: String },
  userData: { type: Object },
  docData: { type: Object },
  amount: { type: Number },
  data: { type: Number },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompeted: { type: Boolean, default: false },
});

export default mongoose.models.appoinment ||
  mongoose.model("appoinment", appoinmentScheema);
