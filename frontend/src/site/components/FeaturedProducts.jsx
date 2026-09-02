import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import "./FeaturedProducts.css";

function FeaturedProducts({ products }) {
    const navigate = useNavigate();

    return (
        <section className="featured-products site-container">
            <div className="featured-products-header">
                <div className="featured-products-heading">
                    <h2>Öne Çıkan Lezzetler</h2>
                    <p>Otağ Cafe'nin sevilen lezzetlerinden seçmeler.</p>
                </div>
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
                    <ProductCard key={product.id} product={product} />
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
