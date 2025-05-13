import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const MyAppoinment = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();

  const [appoinment, setAppoinment] = useState([]);
  const months = [
    "",
    "Jan",
    "Fab",
    "March",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormate = (sloteDate) => {
    const dateArray = sloteDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };
  const getAppoinment = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/get-appoinment`,
        { headers: { token } }
      );
      if (data.success) {
        setAppoinment(data.appoinment.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancleAppoinment = async (appoinmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancle-appoinment`,
        { appoinmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppoinment();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: "rzp_test_CuW3VSbQWSUDVJ",
      amount: order.amount,
      currency: order.currency,
      name: "Appoinment Payment",
      description: "Appoinment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async () => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-payment`,

            { receipt: order.receipt },
            { headers: { token } }
          );
          if (data.success) {
            toast.success(data.message);
            getAppoinment();
            getDoctorsData();
            navigate("/my-appoinment");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const payment = async (appoinmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment`,
        { appoinmentId },
        {
          headers: { token },
        }
      );
      if (data.success) {
        initPay(data.order);

        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getAppoinment();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appoinments
      </p>

      <div>
        {appoinment.map((item, i) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={i}
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address</p>
              <p className="text-xs">{item.docData.address?.line1}</p>
              <p className="text-xs">{item.docData.address?.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:{" "}
                </span>
                {slotDateFormate(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>

            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment && !item.isCompeted && (
                <button className="sm:min-w-40 py-2 border rounded text-stone-500 bg-indigo-50">
                  Paid
                </button>
              )}

              {!item.cancelled && !item.payment && !item.isCompeted && (
                <button
                  onClick={() => payment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded cursor-pointer hover:bg-blue-600 transition-all duration-200 hover:text-white"
                >
                  Pay Online
                </button>
              )}

              {!item.cancelled && !item.isCompeted && (
                <button
                  onClick={() => cancleAppoinment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded cursor-pointer  hover:bg-red-600 transition-all duration-200 hover:text-white"
                >
                  Cancle Appoinment
                </button>
              )}
              {item.cancelled && !item.isCompeted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appoinmnet Cancelled
                </button>
              )}
              {item.isCompeted && (
                <button className="sm:min-w-48 py-2 border rounded border-green-500 text-green-500">
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppoinment;
