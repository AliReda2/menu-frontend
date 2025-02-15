import { createContext, useContext, useState } from "react";

const ShopContext = createContext();

export const useShopId = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [shopId, setShopId] = useState(null);

  return (
    <ShopContext.Provider value={{ shopId, setShopId }}>
      {children}
    </ShopContext.Provider>
  );
};
