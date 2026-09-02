import { useMemo, useState } from "react";
import SiteLayout from "../components/SiteLayout";
import SitePageHeader from "../components/SitePageHeader";
import ProductCard from "../components/ProductCard";
import { useSiteProducts } from "../data/useSiteProducts";
import "./FullMenu.css";

function FullMenu() {
    const [activeCategory, setActiveCategory] = useState("ALL");
    const { products, categories, loading, error } = useSiteProducts();

    const filteredProducts = useMemo(() => {
        if (activeCategory === "ALL") {
            return products;
        }
        return products.filter((product) => product.categoryName === activeCategory);
    }, [activeCategory, products]);

    return (
        <SiteLayout>
            <SitePageHeader
                eyebrow="Menü"
                title="Tüm Lezzetlerimiz"
                description="Otağ Cafe mutfağından özenle hazırlanmış burgerler, pizzalar ve içecekler."
            />

            <section className="full-menu site-container">
                {loading ? (
                    <p className="site-status-message">Menü yükleniyor...</p>
                ) : error ? (
                    <p className="site-status-message">{error}</p>
                ) : (
                    <>
                        <div className="full-menu-tabs">
                            <button
                                type="button"
                                className={`full-menu-tab${activeCategory === "ALL" ? " active" : ""}`}
                                onClick={() => setActiveCategory("ALL")}
                            >
                                Tümü
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    className={`full-menu-tab${activeCategory === category.name ? " active" : ""}`}
                                    onClick={() => setActiveCategory(category.name)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        <div className="full-menu-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </SiteLayout>
    );
}

export default FullMenu;
