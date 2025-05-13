import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = "$";
  const CalculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();

    return age;
  };

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
  const value = {
    CalculateAge,
    slotDateFormate,
    currency,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
