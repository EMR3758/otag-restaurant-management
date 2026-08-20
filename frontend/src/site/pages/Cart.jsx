import { useNavigate } from "react-router-dom";
import SiteLayout from "../components/SiteLayout";
import SitePageHeader from "../components/SitePageHeader";
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();

    return (
        <SiteLayout>
            <SitePageHeader eyebrow="Sepet" title="Sepetiniz" />

            <section className="cart-empty site-container">
                <span className="material-symbols-outlined">shopping_bag</span>
                <h2>Sepetiniz Boş</h2>
                <p>Lezzetli seçeneklerimizi keşfedip sepetinize ürün ekleyebilirsiniz.</p>
                <button type="button" onClick={() => navigate("/full-menu")}>
                    Menüye Git
                </button>
            </section>
        </SiteLayout>
    );
}

export default Cart;
