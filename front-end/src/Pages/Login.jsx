import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
const Login = () => {
  const [state, setState] = useState("Sign up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "Sign up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success(data.message);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign up" ? "Create Account" : "Login"} up to book
          appointment
        </p>
        {state === "Sign up" && (
          <div className="w-full">
            <p>Full Name:</p>
            <input
              type="text"
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter Full Name..."
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email:</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter email..."
            required
          />
        </div>
        <div className="w-full">
          <p>Password:</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter password..."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 mt-1 cursor-pointer"
        >
          {state === "Sign up" ? "Create Account" : "Login"}
        </button>
        {state === "Sign up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-500 underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create an new account?{" "}
            <span
              onClick={() => setState("Sign up")}
              className="text-blue-500 underline cursor-pointer"
            >
              Click here!
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
