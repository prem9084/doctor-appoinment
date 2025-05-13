import mongoose from "mongoose";

const userScheema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://imgs.search.brave.com/OAAUQuaTE_rXIrdzP6gDvVA_WTm16YgNEoEYaNSUw4w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2Y5L2Iw/LzZlL2Y5YjA2ZWVh/NGY0ZjU3NmNhOTJm/YTJmMzVlNjIwNmY3/LmpwZw",
  },

  address: {
    type: Object,
    default: { line1: "", line2: "" },
  },
  gender: {
    type: String,
    default: "Not Selected",
  },
  dob: {
    type: String,
    default: "Not Selected",
  },
  phone: {
    type: String,
    default: "0000000000",
  },
});

export default mongoose.models.user || mongoose.model("user", userScheema);
