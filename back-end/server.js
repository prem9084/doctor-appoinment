import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import Connnetdb from "./config/mogodb.js";

import adminRoute from "./routes/AdminRoute.js";
import doctorRoute from "./routes/DoctorRoute.js";
import userRoute from "./routes/UserRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
const app = express();

dotenv.config();
Connnetdb();
connectCloudinary();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// api end point

app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/user", userRoute);

app.get("/", (req, res) => {
  res.send("API working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listing on port ${PORT}`);
});
