import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../Context/AdminContext";
import { useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { assets } from "../../assets/assets.js";

const AllApoinments = () => {
  const { atoken, appoinments, getAllApppoinments, adminCancleAppoinment } =
    useContext(AdminContext);
  const { CalculateAge, slotDateFormate, currency } = useContext(AppContext);
  useEffect(() => {
    getAllApppoinments();
  }, [atoken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appoinments</p>
      <div className="bg-white border  rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {appoinments.map((item, i) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col text-center text-gray-500 py-3 px-6 border-b hover:bg-gray-200"
            key={i}
          >
            <p className="max-sm:hidden">{i + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt=""
              />
              <p>{item.userData.name}</p>
            </div>
            <p className="max-sm-hidden">{CalculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormate(item.slotDate)},{item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full bg-gray-200"
                src={item.docData.image}
                alt=""
              />
              <p>{item.docData.name}</p>
            </div>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-500 text-xs font-medium">Cancelled</p>
            ) : item.isCompeted ? (
              <p className="text-green-500 text-xs font-medium">Completed</p>
            ) : (
              <>
                <img
                  onClick={() => adminCancleAppoinment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllApoinments;
