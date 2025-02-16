import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [globalNumber, setGlobalNumber] = useState(null);

  return (
    <GlobalContext.Provider value={{ globalNumber, setGlobalNumber }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
