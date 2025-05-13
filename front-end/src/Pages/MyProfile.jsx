import React, { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets.js";

import axios from "axios";

const MyProfile = () => {
  const { userData, setUserData, backendUrl, token, loadUserProfileData } =
    useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", userData.name);

      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      image && formData.append("image", image);
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  };

  return (
    userData && (
      <div className="max-w-lg flex flex-col gap-2 text-sm">
        {edit ? (
          <label htmlFor="image">
            <div className="inline-blobk relative cursor-pointer">
              <img
                className="w-36 rounded-full opacity-75 bg-gray-300"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
              />
              <img
                className="w-36 absolute bottom-12 right-12"
                src={image ? "" : assets.upload_icon}
                alt=""
              />
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img
            className="w-36 rounded-full bg-gray-300"
            src={userData.image}
            alt=""
          />
        )}

        {edit ? (
          <>
            <input
              className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </>
        ) : (
          <>
            <p className="font-medium text-3xl text-neutral-800 mt-4">
              {userData.name}
            </p>
          </>
        )}
        <hr className="bg-zinc-400 h-[1px] border-none" />
        <div>
          <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium ">Email:</p>
            <p className="text-blue-500">{userData.email}</p>
            <p className="font-medium">Phone</p>
            {edit ? (
              <>
                <input
                  className="bg-gray-100 max-w-52"
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </>
            ) : (
              <>
                <p className="text-blue-400">{userData.phone}</p>
              </>
            )}
            <p className="font-medium ">Address</p>
            <p>
              {edit ? (
                <p>
                  <input
                    className="bg-gray-50"
                    type="text"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={userData.address?.line1}
                  />
                  <br />
                  <input
                    type="text"
                    className="bg-gray-50"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={userData.address?.line2}
                  />
                </p>
              ) : (
                <p className="text-gray-500">
                  {userData?.address?.line1} <br />
                  <p> {userData?.address?.line2}</p>
                </p>
              )}
            </p>
          </div>
          <div>
            <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
            <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
              <p className="font-medium">Gender:</p>
              {edit ? (
                <>
                  <select
                    className="max-w-20 bg-gray-100"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    value={userData.gender}
                  >
                    <option>Note Selected</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </>
              ) : (
                <>
                  <p className="text-gray-400">{userData.gender}</p>
                </>
              )}
              <p className="font-medium">Birthday:</p>
              {edit ? (
                <>
                  <input
                    className="max-w-28 bg-gray-100"
                    type="date"
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, dob: e.target.value }))
                    }
                    value={userData.dob}
                  />
                </>
              ) : (
                <>
                  <p className="text-gray-400">{userData.dob}</p>
                </>
              )}
            </div>
          </div>
          <div className="mt-10">
            {edit ? (
              <button
                onClick={handleUpdate}
                className="border border-blue-600 px-8 py-2 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Save Information
              </button>
            ) : (
              <button
                className="border border-blue-600 px-8 py-2 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-300"
                onClick={() => setEdit(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
