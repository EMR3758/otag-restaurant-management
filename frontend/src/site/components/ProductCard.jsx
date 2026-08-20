import "./ProductCard.css";

function formatPrice(price) {
    return `${Number(price).toLocaleString("tr-TR")} ₺`;
}

function ProductCard({ product, onAddToCart = () => {} }) {
    const { name, price, imageUrl, description, badge } = product;

    return (
        <article className="product-card">
            <div className="product-card-media">
                <img src={imageUrl} alt={name} />
                <span className="product-card-price">{formatPrice(price)}</span>
            </div>

            <div className="product-card-body">
                <div className="product-card-heading">
                    <h3>{name}</h3>
                    <button
                        type="button"
                        className="product-card-add"
                        aria-label={`${name} ürününü sepete ekle`}
                        onClick={() => onAddToCart(product)}
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>

                {description && <p className="product-card-description">{description}</p>}

                {badge && (
                    <div className="product-card-badges">
                        <span className="product-badge">{badge}</span>
                    </div>
                )}
            </div>
        </article>
    );
}

export default ProductCard;
