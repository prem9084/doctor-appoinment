import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,

      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    speciality: {
      type: String,
    },
    degree: {
      type: String,
    },
    experience: {
      type: String,
    },
    about: {
      type: String,
    },
    available: {},
    fees: {
      type: Number,
    },
    address: {
      type: Object,
    },
    date: {
      type: Number,
    },
    slots_booked: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

export default mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
