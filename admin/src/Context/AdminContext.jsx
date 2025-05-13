import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [atoken, setAtoken] = useState(
    localStorage.getItem("atoken") ? localStorage.getItem("atoken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [appoinments, setAppoinments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        { headers: { atoken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        { headers: { atoken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllApppoinments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appoinments`, {
        headers: { atoken },
      });
      if (data.success) {
        setAppoinments(data.appoinments);
        console.log(data.appoinments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const adminCancleAppoinment = async (appoinmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/admin-cancle-appoinment`,
        { appoinmentId },
        { headers: { atoken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllApppoinments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/admin-dash`, {
        headers: { atoken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // useEffect(() => {
  //   if (atoken) {
  //     getAllApppoinments();
  //   }
  // }, [atoken]);

  const value = {
    atoken,
    setAtoken,
    backendUrl,
    getAllDoctors,
    doctors,
    changeAvailability,
    appoinments,
    setAppoinments,
    getAllApppoinments,
    adminCancleAppoinment,
    getDashData,
    dashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
