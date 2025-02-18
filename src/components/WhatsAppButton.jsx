import "../style/WhatsAppButton.css";

const WhatsAppButton = ({ addedProducts, quantity, total }) => {
  if (addedProducts.length === 0) return null;

  const message =
    `Hello! I’m interested in your services. I want to buy ${quantity} item(s), totaling $${total.toFixed(
      2
    )}.\n\nHere are the details:\n\n` +
    addedProducts
      .map((product) => {
        return `${product.name} (x${product.quantity}) - $${(
          product.price * product.quantity
        ).toFixed(2)}`;
      })
      .join("\n");

  const phoneNumber = "+96170031455"; // Replace with your WhatsApp number
  const whatsAppLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="whatsapp-button-container">
      <div className="quantity">
        <h3>Quantity:</h3>
        <p>{quantity}</p>
      </div>
      <div className="total">
        <h3>Total:</h3>
        <p>${total.toFixed(2)}</p>
      </div>
      <a
        href={whatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="whatsapp-icon"
        />
      </a>
    </div>
  );
};

export default WhatsAppButton;
