import "../style/Categories.css";

const Categories = ({ onCategoryClick, category }) => {
  return (
    <div className="categories">
      <div className="category-box" onClick={() => onCategoryClick(null)}>
        <span style={{ color: "black", fontSize: "x-Large" }}>All</span>
      </div>
      {category.map((category) => (
        <div
          key={category.id}
          className="category-box"
          onClick={() => onCategoryClick(category.id)}
        >
          <img
            src={category.image}
            alt={category.name}
            width="50"
          />
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Categories;
