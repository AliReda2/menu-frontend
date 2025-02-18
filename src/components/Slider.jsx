import { useState, useEffect } from "react";
import "../style/Slider.css";

const Slider = ({ shop }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const img = new Image();
    img.src = `https://menu-backend-rnpu.onrender.com/${shop.image}`;
    img.onload = () => {
      setImageSrc(img.src);
      setImageLoaded(true);
    };
  }, [shop.image]);

  return (
    <div
      className="slider"
      style={{ backgroundImage: imageLoaded ? `url(${imageSrc})` : "none" }}
    >
      {!imageLoaded && <div className="placeholder">Loading...</div>}
      <div className="slide">
        <h1>Welcome to {shop.name}</h1>
        <p>{shop.description}</p>
      </div>
    </div>
  );
};

export default Slider;
