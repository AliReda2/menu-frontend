import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import "../style/Body.css";
import Categories from "./Categories";

const Body = ({
  handleQuantityChange,
  quantities,
  setCategory,
  category,
  selectedAddOns,
  setSelectedAddOns,
  handleDuplicateAdd,
  handleDuplicateQuantityChangeGlobal,
  shop,
  shopId,
}) => {
  const [addOns, setAddOns] = useState([]);
  const [duplicateProducts, setDuplicateProducts] = useState({});
  const sectionRefs = useRef({});
  const [activeCategory, setActiveCategory] = useState(null);
  useEffect(() => {
    if (!shopId) {
      console.log("shopId is not set yet. Skipping API call.");
      return;
    }

    setCategory(shop.categories);
    const fetchAddOns = async () => {
      try {
        const response = await api.get(`/addOns?shop_id=${shopId}`); // Use dynamic shopId
        setAddOns(response.data);
      } catch (error) {
        console.error("Error fetching add-ons:", error);
      }
    };

    fetchAddOns();
  }, [shopId, setCategory]); // Ensure useEffect runs whenever shopId changes

  const handleAddOnChange = (product, addOnId) => {
    if (!addOnId) return; // "None" selected
    const chosenAddOn = addOns.find((addOn) => addOn.id === Number(addOnId));
    if (chosenAddOn) {
      setDuplicateProducts((prev) => {
        const prevForProduct = prev[product.id] || {};
        return {
          ...prev,
          [product.id]: {
            ...prevForProduct,
            [chosenAddOn.id]: { addOn: chosenAddOn, quantity: 1 },
          },
        };
      });
      setSelectedAddOns((prev) => ({
        ...prev,
        [product.id]: null,
      }));
      handleDuplicateAdd(product, chosenAddOn);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleDuplicateQuantityChange = (
    productId,
    addOnId,
    change,
    product
  ) => {
    setDuplicateProducts((prev) => {
      const prevForProduct = prev[productId];
      if (!prevForProduct || !prevForProduct[addOnId]) return prev;
      const newQuantity = prevForProduct[addOnId].quantity + change;
      if (newQuantity <= 0) {
        const { [addOnId]: removed, ...restForProduct } = prevForProduct;
        return { ...prev, [productId]: restForProduct };
      } else {
        return {
          ...prev,
          [productId]: {
            ...prevForProduct,
            [addOnId]: { ...prevForProduct[addOnId], quantity: newQuantity },
          },
        };
      }
    });
    handleDuplicateQuantityChangeGlobal(productId, addOnId, change);
  };

  return (
    <div className="body">
      <Categories shopId={shopId} onCategoryClick={handleCategoryClick} />
      <h2 className="section-title">Our Specialties</h2>
      {category
        .filter((cat) => !activeCategory || cat.id === activeCategory)
        .map((cat) => (
          <div key={cat.id} ref={(el) => (sectionRefs.current[cat.id] = el)}>
            <h3>{cat.name}</h3>
            <div className="slider-container">
              {cat.menu.map((product) => {
                const duplicateExists =
                  duplicateProducts[product.id] &&
                  Object.keys(duplicateProducts[product.id]).length > 0;
                const selectValue = duplicateExists
                  ? ""
                  : selectedAddOns[product.id]?.id || "";
                return (
                  <React.Fragment key={product.id}>
                    <div className="slider-item">
                      <div className="product-image">
                        <img
                          src={`https://menu-backend-rnpu.onrender.com/${product.image}`}
                          alt={product.name}
                          width="50"
                        />
                      </div>
                      <div className="product-details">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div>
                          <p className="price">
                            ${Number(product.price).toFixed(2)}
                          </p>
                          <div className="quantity-controls">
                            <button
                              onClick={() =>
                                handleQuantityChange(product.id, -1, product)
                              }
                            >
                              -
                            </button>
                            <span>{quantities[product.id] || 0}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(product.id, 1, product)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div>
                          <label htmlFor={`add-on-${product.id}`}>
                            Add On:
                          </label>
                          <select
                            id={`add-on-${product.id}`}
                            value={selectValue}
                            onChange={(e) =>
                              handleAddOnChange(product, e.target.value)
                            }
                          >
                            <option value="">None</option>
                            {addOns
                              .filter(
                                (addOn) =>
                                  !(
                                    duplicateProducts[product.id] &&
                                    duplicateProducts[product.id][addOn.id]
                                  )
                              )
                              .map((addOn) => (
                                <option key={addOn.id} value={addOn.id}>
                                  {addOn.name} (+${addOn.price})
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    {duplicateProducts[product.id] &&
                      Object.values(duplicateProducts[product.id]).map(
                        (dup) => (
                          <div
                            key={`${product.id}-addon-${dup.addOn.id}`}
                            className="slider-item duplicate"
                          >
                            <div className="product-image">
                              <img
                                src={`https://menu-backend-rnpu.onrender.com/${product.image}`}
                                alt={product.name}
                                width="50"
                              />
                            </div>
                            <div className="product-details">
                              <h3>
                                {product.name} with {dup.addOn.name}
                              </h3>
                              {product.description && (
                                <p>{product.description}</p>
                              )}
                              <div>
                                <p className="price">
                                  $
                                  {(
                                    Number(product.price) +
                                    Number(dup.addOn.price)
                                  ).toFixed(2)}
                                </p>

                                <div className="quantity-controls">
                                  <button
                                    onClick={() =>
                                      handleDuplicateQuantityChange(
                                        product.id,
                                        dup.addOn.id,
                                        -1,
                                        product
                                      )
                                    }
                                  >
                                    -
                                  </button>
                                  <span>{dup.quantity}</span>
                                  <button
                                    onClick={() =>
                                      handleDuplicateQuantityChange(
                                        product.id,
                                        dup.addOn.id,
                                        1,
                                        product
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div>
                                <span>
                                  Add‑On: {dup.addOn.name} (+ ${dup.addOn.price}
                                  )
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Body;
