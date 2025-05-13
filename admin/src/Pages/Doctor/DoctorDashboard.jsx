import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../Context/DoctorContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../Context/AppContext";
const DoctorDashboard = () => {
  const {
    dtoken,
    DocDashboard,
    dashData,
    CanceleAppoinment,
    ApponmentComplete,
  } = useContext(DoctorContext);
  const { currency, slotDateFormate } = useContext(AppContext);
  useEffect(() => {
    if (dtoken) {
      DocDashboard();
    }
  }, [dtoken]);

  return (
    dashData && (
      <div className="m-5">
        {" "}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency} {dashData.earnings}
              </p>
              <p className="text-gray-400">Earning</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appoinments}
              </p>
              <p className="text-gray-400">Appoinments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>
          <div className="pt-4 border border-t-0">
            {dashData.latestAppoinments.map((item, i) => (
              <div
                key={i}
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
              >
                <img
                  className="rounded-full w-10"
                  src={item.userData.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.userData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormate(item.slotDate)}
                  </p>
                </div>

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
      </div>
    )
  );
};

export default DoctorDashboard;
