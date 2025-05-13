import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctor from "../Components/RelatedDoctor";
import { toast } from "react-toastify";
import axios from "axios";
const Appoinment = () => {
  const { docId } = useParams();
  const { doctors, currencySym, token, backendUrl, getDoctorsData } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIntex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAbilableSlot = async () => {
    setDocSlot([]);

    // get current date

    let today = new Date();
    for (let i = 0; i < 7; i++) {
      // getting date with index

      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // end time of the date with index

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hourse

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formetedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formetedTime;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formetedTime,
          });
        }

        // add slot to array

        // increment current time by 30 min
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlot((prev) => [...prev, timeSlots]);
    }
  };

  const BookAppoinment = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.warn("First login to book appoinment");
      return navigate("/login");
    }
    try {
      const date = docSlot[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appoinment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appoinment");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);
  useEffect(() => {
    getAbilableSlot();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlot);
  }, [docSlot]);

  return (
    docInfo && (
      <div>
        {/* --------Doctor Details------ */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="w-full sm:mx-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
              style={{ backgroundColor: "#5f6FFF" }}
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7  bg-white mx-2 sm:mx-0  sm:mt-0 ">
            {/* Doc Info name digree expreance */}
            <p className="flex items-center gap-2 text-2xl text-gray-900 ">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            {/* ---- Doctor About--- */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-600 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-">
              Appoinment Fee:{" "}
              <span className="text-gray-600">
                {currencySym}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>
        {/* -----Bookin Slot---- */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlot.length &&
              docSlot.map((item, i) => (
                <div
                  onClick={() => setSlotIntex(i)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === i
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200"
                  }`}
                  key={i}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlot.length &&
              docSlot[slotIndex].map((item, i) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  key={i}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 border border-gray-400"
                  }`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={BookAppoinment}
            className="bg-blue-600 text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer "
          >
            Book Appoinment
          </button>
          {/* Listing Related Doctors */}

          <RelatedDoctor docId={docId} speciality={docInfo.speciality} />
        </div>
      </div>
    )
  );
};

export default Appoinment;
