import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";
const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const Loggout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("User Logout Successfully");
  };
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to={"/"}>
          <li className="py-1">Home</li>
          <hr
            className="border-none outline-none h-0.5  w-3/5 m-auto hidden"
            style={{ backgroundColor: "#5f6FFF" }}
          />
        </NavLink>
        <NavLink to={"/doctors"}>
          <li className="py-1">All Doctors</li>
          <hr
            className="border-none outline-none h-0.5 w-3/5 m-auto hidden"
            style={{ backgroundColor: "#5f6FFF" }}
          />
        </NavLink>
        <NavLink to={"/about"}>
          <li className="py-1">About</li>
          <hr
            className="border-none outline-none h-0.5  w-3/5 m-auto hidden"
            style={{ backgroundColor: "#5f6FFF" }}
          />
        </NavLink>
        <NavLink to={"/contact"}>
          <li className="py-1">Contact</li>
          <hr
            className="border-none outline-none h-0.5  w-3/5 m-auto hidden"
            style={{ backgroundColor: "#5f6FFF" }}
          />
        </NavLink>
        <a
          href="https://doctor-appoinment-admin.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li className="py-1 px-10 border border-gray-500 rounded-full text-sm font-medium">
            ADMIN
          </li>
          <hr
            className="border-none outline-none h-0.5 w-3/5 m-auto hidden"
            style={{ backgroundColor: "#5f6FFF" }}
          />
        </a>
      </ul>
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center cursor-pointer gap-2 group relative">
            <img src={assets.profile_pic} alt="" className="w-8 rounded-full" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 pt-14 text-base text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appoinment")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appoinments
                </p>
                <p
                  onClick={Loggout}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-white px-8 py-3 cursor-pointer rounded-full hidden md:block"
              style={{ backgroundColor: "#5f6FFF" }}
            >
              Create Account
            </button>
          </>
        )}
        <img
          className="w-6 md:hidden"
          src={assets.menu_icon}
          onClick={() => setShowMenu(true)}
        />
        {/* -------Mobile Menu------ */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded-full inline-block">Home</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded-full inline-block">All DOCTORS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded-full inline-block">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded-full inline-block">CONTACT</p>
            </NavLink>
            <a
              href="https://doctor-appoinment-admin.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <li className="py-1  text-sm font-medium rounded-full px-10 border border-gray-500">
                ADMIN
              </li>
              <hr
                className="border-none outline-none h-0.5 w-3/5 m-auto hidden"
                style={{ backgroundColor: "#5f6FFF" }}
              />
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
