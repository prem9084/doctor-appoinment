import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../Context/DoctorContext";
import { useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppoinments = () => {
  const {
    DocAppoinment,
    appoinments,
    dtoken,
    ApponmentComplete,
    CanceleAppoinment,
  } = useContext(DoctorContext);
  const { CalculateAge, slotDateFormate, currency } = useContext(AppContext);
  useEffect(() => {
    if (dtoken) {
      DocAppoinment();
    }
  }, [dtoken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appoinments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appoinments.reverse().map((item, i) => (
          <div
            key={i}
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center py-3 px-6  border- text-gray-400  hover:bg-gray-100"
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
            <div>
              <p className="text-xs inline border border-blue-500 px-2 rounded-full">
                {item.payment ? "Online" : "CASH"}
              </p>
            </div>
            <p className="max-sm:hidden">{CalculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormate(item.slotDate)}, {item.slotTime}
            </p>
            <p>
              {currency} {item.amount}
            </p>

            {item.cancelled ? (
              <p className="text-sm  text-red-400 text-center rounded">
                Cancelled
              </p>
            ) : item.isCompeted ? (
              <p className="text-sm  text-blue-600 text-center rounded">
                Completed
              </p>
            ) : (
              <div className="flex">
                <img
                  onClick={() => CanceleAppoinment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />

                <img
                  onClick={() => ApponmentComplete(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.tick_icon}
                  alt=""
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppoinments;
