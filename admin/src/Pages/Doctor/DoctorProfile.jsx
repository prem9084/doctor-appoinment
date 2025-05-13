import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../Context/DoctorContext";
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const { dtoken, profileData, getProfileData, setProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,

        updateData,
        { headers: { dtoken } }
      );
      if (data && data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dtoken) {
      getProfileData();
    }
  }, [dtoken]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              className="bg-blue-400/80 w-full sm:max-w-64 rounded-lg"
              src={profileData.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {/* DOC INFO */}

            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {profileData.experience}
              </button>
            </div>
            {/* DOCTOR ABOUT */}

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About:
              </p>
              <p className="text-sm text-gray-600 mt-1 max-w-[700px]">
                {profileData.about}
              </p>
            </div>
            <p className="text-gray-600 font-medium mt-4">
              Appoinment Fees:{" "}
              <span className="text-gray-800">
                {currency}{" "}
                {isEdit ? (
                  <>
                    <input
                      type="number"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          fees: e.target.value,
                        }))
                      }
                      value={profileData.fees}
                      name=""
                      id=""
                    />
                  </>
                ) : (
                  profileData.fees
                )}
              </span>
            </p>
            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm">
                {isEdit ? (
                  <>
                    <input
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))
                      }
                      value={profileData.address.line1}
                    />
                  </>
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <>
                    <input
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))
                      }
                      value={profileData.address.line2}
                    />
                  </>
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>
            <div className="flex gap-1 pt-2">
              <input
                type="checkbox"
                checked={profileData.available}
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
              />
              <label htmlFor="">Available</label>
            </div>

            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-4 py-1 border border-blue-500 text-sm rounded-full mt-5 hover:bg-blue-500 hover:text-white transition-all"
              >
                Save
              </button>
            ) : (
              <>
                {" "}
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-4 py-1 border border-blue-500 text-sm rounded-full mt-5 hover:bg-blue-500 hover:text-white transition-all"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
