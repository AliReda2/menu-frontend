import { createContext, useContext, useState, useEffect } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  // Read shopId from localStorage on mount
  const [shopId, setShopIdInternal] = useState(() => {
    const storedShopId = localStorage.getItem("shop_id");
    return storedShopId ? Number(storedShopId) : null;
  });

  const setShopId = (value) => {
    if (value === null) {
      console.warn("Invalid shopId value. It must be a non-null number.");
      return;
    }
    const parsedValue = typeof value === "string" ? Number(value) : value;
    if (typeof parsedValue === "number" && !isNaN(parsedValue)) {
      setShopIdInternal(parsedValue);
      localStorage.setItem("shop_id", parsedValue); // Store in localStorage
    } else {
      console.warn("Invalid shopId value. It must be a non-null number.");
    }
  };

  useEffect(() => {
    // console.log("GlobalState Updated: shopId =", shopId);
  }, [shopId]);

  return (
    <GlobalStateContext.Provider value={{ shopId, setShopId }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
