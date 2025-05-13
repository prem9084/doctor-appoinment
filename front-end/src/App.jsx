import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Doctors from "./Pages/Doctors";
import MyAppoinment from "./Pages/MyAppoinment";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Appoinment from "./Pages/Appoinment";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import MyProfile from "./Pages/MyProfile";
const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/my-appoinment" element={<MyAppoinment />} />
        <Route path="/appoinment/:docId" element={<Appoinment />} />

        <Route path="/profile" element={<MyProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
