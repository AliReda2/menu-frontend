import { createContext, useContext, useState, useEffect } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [shopId, setShopIdInternal] = useState(null);

  // Custom setter that only accepts non-null numbers
  const setShopId = (value) => {
    if (value !== null && typeof value === "number") {
      setShopIdInternal(value);
    } else {
      console.warn("Invalid shopId value. It must be a non-null number.");
    }
  };

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
