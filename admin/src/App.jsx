import React, { useContext } from "react";
import Login from "./Pages/Login";
import { AdminContext } from "./Context/AdminContext";
import NavBar from "./Components/NavBar";
import Sidebar from "./Components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashbord from "./Pages/Admin/Dashbord";
import AllApoinments from "./Pages/Admin/AllApoinments";
import AddDoctor from "./Pages/Admin/AddDoctor";
import DoctorsList from "./Pages/Admin/DoctorsList";
import { DoctorContext } from "./Context/DoctorContext";
import DoctorDashboard from "./Pages/Doctor/DoctorDashboard";
import DoctorAppoinments from "./Pages/Doctor/DoctorAppoinments";
import DoctorProfile from "./Pages/Doctor/DoctorProfile";
("./Context/AppContext");
const App = () => {
  const { atoken } = useContext(AdminContext);
  const { dtoken } = useContext(DoctorContext);
  return atoken || dtoken ? (
    <div className="bg-[#F8F9FD]">
      <NavBar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Route */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashbord />} />
          <Route path="/all-appoinments" element={<AllApoinments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />

          {/* Doctor Route */}

          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appoinment" element={<DoctorAppoinments />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
    </>
  );
};

export default App;
