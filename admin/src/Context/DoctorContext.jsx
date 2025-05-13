import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dtoken, setDtoken] = useState(
    localStorage.getItem("dtoken") ? localStorage.getItem("dtoken") : ""
  );

  const [appoinments, setAppoinments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const DocAppoinment = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/doc-appoinment`,
        { headers: { dtoken } }
      );
      if (data.success) {
        setAppoinments(data.appoinments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ApponmentComplete = async (appoinmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/completed`,
        { appoinmentId },
        {
          headers: { dtoken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        DocAppoinment();
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const CanceleAppoinment = async (appoinmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancelled`,
        { appoinmentId },
        {
          headers: { dtoken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        DocAppoinment();
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const DocDashboard = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/dashboard`,

        { headers: { dtoken } }
      );
      if (data && data?.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/profile`,

        { headers: { dtoken } }
      );
      if (data && data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    backendUrl,
    dtoken,
    setDtoken,
    DocAppoinment,
    appoinments,
    setAppoinments,
    ApponmentComplete,
    CanceleAppoinment,
    dashData,
    setDashData,
    DocDashboard,
    profileData,
    setProfileData,
    getProfileData,
  };
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
