// src/pages/Home.js
import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Slider from "../components/Slider";
import Body from "../components/Body";
import WhatsAppButton from "../components/WhatsAppButton";

const Home = () => {
  const { shopId } = useParams(); // Extract shopId from the URL
  const [quantities, setQuantities] = useState({});
  const [category, setCategory] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState({});

  // Handles quantity changes for original products.
  const handleQuantityChange = (productId, delta, product) => {
    setQuantities((prevState) => {
      const updatedQuantities = {
        ...prevState,
        [productId]: Math.max(0, (prevState[productId] || 0) + delta),
      };

      setAddedProducts((prevAddedProducts) => {
        const productIndex = prevAddedProducts.findIndex(
          (p) => p.id === productId
        );
        // Use current add‑on from lifted state; default price 0 if none.
        const currentAddOn = selectedAddOns[productId] || { price: 0 };
        const totalPrice = Number(product.price) + Number(currentAddOn.price);
        if (updatedQuantities[productId] > 0) {
          if (productIndex === -1) {
            return [
              ...prevAddedProducts,
              {
                id: productId,
                name: product.name,
                price: totalPrice,
                quantity: updatedQuantities[productId],
                addOn: currentAddOn,
              },
            ];
          }
          const updatedProducts = [...prevAddedProducts];
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            quantity: updatedQuantities[productId],
            price: totalPrice,
            addOn: currentAddOn,
          };
          return updatedProducts;
        }
        return prevAddedProducts.filter((p) => p.id !== productId);
      });
      return updatedQuantities;
    });
  };

  // Add a duplicate (add‑on) product to the global order.
  const handleDuplicateAdd = (product, addOn) => {
    const duplicateId = `${product.id}-addon-${addOn.id}`;
    setAddedProducts((prevAddedProducts) => {
      const duplicateIndex = prevAddedProducts.findIndex(
        (p) => p.id === duplicateId
      );
      if (duplicateIndex === -1) {
        return [
          ...prevAddedProducts,
          {
            id: duplicateId,
            name: `${product.name} with ${addOn.name}`,
            price: Number(product.price) + Number(addOn.price),
            quantity: 1,
            addOn,
          },
        ];
      } else {
        return prevAddedProducts.map((p) =>
          p.id === duplicateId ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
    });
  };

  // Update duplicate product quantity in the global order.
  const handleDuplicateQuantityChangeGlobal = (productId, addOnId, change) => {
    const duplicateId = `${productId}-addon-${addOnId}`;
    if (change === "remove") {
      setAddedProducts((prev) => prev.filter((p) => p.id !== duplicateId));
      return;
    }
    setAddedProducts((prevAddedProducts) =>
      prevAddedProducts
        .map((p) => {
          if (p.id === duplicateId) {
            const newQuantity = p.quantity + change;
            return newQuantity > 0 ? { ...p, quantity: newQuantity } : null;
          }
          return p;
        })
        .filter(Boolean)
    );
  };

  const total = addedProducts.reduce(
    (acc, product) => acc + Number(product.price) * product.quantity,
    0
  );
  const quantity = addedProducts.reduce(
    (acc, product) => acc + product.quantity,
    0
  );

  return (
    <>
      {/* Pass shopId as a prop to children components */}
      <Slider shopId={shopId} />
      <Body
        shopId={shopId}
        handleQuantityChange={handleQuantityChange}
        quantities={quantities}
        setCategory={setCategory}
        category={category}
        selectedAddOns={selectedAddOns}
        setSelectedAddOns={setSelectedAddOns}
        handleDuplicateAdd={handleDuplicateAdd}
        handleDuplicateQuantityChangeGlobal={
          handleDuplicateQuantityChangeGlobal
        }
      />
      <WhatsAppButton
        shopId={shopId}
        addedProducts={addedProducts}
        total={total}
        quantity={quantity}
      />
    </>
  );
};

export default Home;
