import React, { useContext, useState } from "react";
// import { assets } from "../assets/assets.js";
import { AdminContext } from "../Context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../Context/DoctorContext.jsx";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAtoken } = useContext(AdminContext);
  const { backendUrl, setDtoken } = useContext(DoctorContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(
          `${backendUrl}/api/admin/login-admin`,
          {
            email,
            password,
          }
        );

        if (data && data?.success) {
          localStorage.setItem("atoken", data.token);
          setAtoken(data.token);
          toast.success(data.message);
          navigate("/admin-dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email,
          password,
        });
        if (data && data?.success) {
          localStorage.setItem("dtoken", data.token);
          setDtoken(data.token);
          toast.success(data.message);
          navigate("/doctor-dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96  border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-center text-2xl  font-semibold m-auto">
          <span className="text-blue-500 ">{state}</span>Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-[#DADADA] rounded p-2 mt-1 w-full"
            type="email"
            required
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-[#DADADA] rounded p-2 mt-1 w-full"
            type="password"
            required
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded w-full py-2 text-base cursor-pointer"
        >
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login{" "}
            <span
              onClick={() => setState("Doctor")}
              className="cursor-pointer text-blue-500 underline"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login{" "}
            <span
              onClick={() => setState("Admin")}
              className="cursor-pointer text-blue-500 underline"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
