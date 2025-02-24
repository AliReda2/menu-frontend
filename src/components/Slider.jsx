import { useState, useEffect } from "react";
import "../style/Slider.css";

const Slider = ({ shop }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [lowResSrc, setLowResSrc] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!shop.image) return;

    const lowResUrl = `${shop.image}?w=50&blur=10`;
    console.log("Low-res image URL:", lowResUrl);
    console.log("Full image URL:", shop.image);

    setLowResSrc(lowResUrl);

    const img = new Image();
    img.src = shop.image;
    img.onload = () => {
      setImageSrc(img.src);
      setImageLoaded(true);
    };
    img.onerror = () => {
      setError(true);
      setImageLoaded(true); // Set to true so we stop showing the low-res image
    };
  }, [shop.image]);

  return (
    <div className="slider">
      <div className="background">
        <img
          src={
            imageLoaded
              ? error
                ? "/path/to/fallback-image.jpg"
                : imageSrc
              : lowResSrc
          }
          alt="Shop"
          className={`background-image ${imageLoaded ? "fade-in" : ""}`}
        />
      </div>
      <div className="slide">
        <h1>Welcome to {shop.name}</h1>
        <p>{shop.description}</p>
      </div>
    </div>
  );
};

export default Slider;
