import "./ProductCard.css";

function formatPrice(price) {
    return `${Number(price).toLocaleString("tr-TR")} ₺`;
}
function ProductCard({ product }) {
    const { name, price, imageUrl } = product;

    return (
        <article className="product-card">
            <div className="product-card-media">
                <img src={imageUrl} alt={name} />
                <span className="product-card-price">{formatPrice(price)}</span>
            </div>

            <div className="product-card-body">
                <h3>{name}</h3>
            </div>
        </article>
    );
}

export default ProductCard;
