import { useState, useEffect } from "react";
import "../style/Slider.css";

const Slider = ({ shop }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [lowResSrc, setLowResSrc] = useState("");

  useEffect(() => {
    if (!shop.image) return;

    console.log("Low-res image URL:", `${shop.image}?w=50&blur=10`);
    console.log("Full image URL:", shop.image);

    setLowResSrc(`${shop.image}?w=50&blur=10`);

    const img = new Image();
    img.src = shop.image;
    img.onload = () => {
      setImageSrc(img.src);
      setImageLoaded(true);
    };
  }, [shop.image]);

  return (
    <div className="slider">
      <div
        className="background"
        style={{
          backgroundImage: `url(${imageLoaded ? imageSrc : lowResSrc})`,
          filter: imageLoaded ? "none" : "blur(10px)", // Blur effect until the image is fully loaded
          transition: "filter 0.5s ease-out",
        }}
      />
      <div className="slide">
        <h1>Welcome to {shop.name}</h1>
        <p>{shop.description}</p>
      </div>
    </div>
  );
};

export default Slider;
