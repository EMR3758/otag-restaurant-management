import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import "./FeaturedProducts.css";

function FeaturedProducts({ products, onAddToCart }) {
    const navigate = useNavigate();

    return (
        <section className="featured-products site-container">
            <div className="featured-products-header">
                <h2>Öne Çıkan Lezzetler</h2>
                <button
                    type="button"
                    className="featured-products-see-all featured-products-see-all-desktop"
                    onClick={() => navigate("/full-menu")}
                >
                    Tümünü Gör
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>

            <div className="featured-products-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
            </div>

            <button
                type="button"
                className="featured-products-see-all featured-products-see-all-mobile"
                onClick={() => navigate("/full-menu")}
            >
                Tümünü Gör
                <span className="material-symbols-outlined">arrow_forward</span>
            </button>
        </section>
    );
}

export default FeaturedProducts;
