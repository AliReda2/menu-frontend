import "../style/Slider.css";

const Slider = ({ shop }) => {
  return (
    <div
      className="slider"
      style={{
        "--background-image": `url(https://menu-backend-rnpu.onrender.com/${shop.image})`,
      }}
    >
      <div className="slide">
        <h1>Welcome to {shop.name}</h1>
        <p>{shop.description}</p>
      </div>
    </div>
  );
};

export default Slider;
