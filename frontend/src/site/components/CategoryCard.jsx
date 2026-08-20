import { useNavigate } from "react-router-dom";
import "./CategoryCard.css";

function CategoryCard({ category, size = "small", to = "/full-menu" }) {
    const navigate = useNavigate();
    const { name, itemCount, imageUrl } = category;

    return (
        <button
            type="button"
            className={`category-card category-card-${size}`}
            onClick={() => navigate(to)}
        >
            <img src={imageUrl} alt={name} />
            <div className="category-card-overlay" />
            <div className="category-card-text">
                <h3>{name}</h3>
                <p>{itemCount} Ürün</p>
            </div>
        </button>
    );
}

export default CategoryCard;
