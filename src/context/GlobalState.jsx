import { createContext, useContext, useState, useEffect } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [shopId, setShopId] = useState(null);

  useEffect(() => {
    console.log("GlobalState Updated: shopId =", shopId);
  }, [shopId]);

  return (
    <GlobalStateContext.Provider value={{ shopId, setShopId }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
