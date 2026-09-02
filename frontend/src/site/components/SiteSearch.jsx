import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSiteProducts } from "../data/useSiteProducts";
import "./SiteSearch.css";

function SiteSearch({ onClose }) {
    const navigate = useNavigate();
    const { products, loading, error } = useSiteProducts();
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const results = useMemo(() => {
        const term = query.trim().toLocaleLowerCase("tr-TR");
        if (!term) {
            return [];
        }
        return products.filter((product) => {
            const name = (product.name ?? "").toLocaleLowerCase("tr-TR");
            const category = (product.categoryName ?? "").toLocaleLowerCase("tr-TR");
            return name.includes(term) || category.includes(term);
        });
    }, [products, query]);

    const goToMenu = () => {
        navigate("/full-menu");
        onClose();
    };

    return (
        <div className="site-search-backdrop" onClick={onClose}>
            <div className="site-search-panel" onClick={(event) => event.stopPropagation()}>
                <div className="site-search-input-row">
                    <span className="material-symbols-outlined">search</span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ürün ara... (ör. Burger, Pizza)"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <button type="button" className="site-search-close" onClick={onClose} aria-label="Aramayı kapat">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="site-search-results">
                    {loading && <p className="site-search-status">Ürünler yükleniyor...</p>}

                    {!loading && error && <p className="site-search-status">{error}</p>}

                    {!loading && !error && query.trim() === "" && (
                        <p className="site-search-status">Aramaya başlamak için ürün adı yazın.</p>
                    )}

                    {!loading && !error && query.trim() !== "" && results.length === 0 && (
                        <p className="site-search-status">"{query}" ile eşleşen ürün bulunamadı.</p>
                    )}

                    {!loading && !error && results.length > 0 && (
                        <ul className="site-search-result-list">
                            {results.map((product) => (
                                <li key={product.id}>
                                    <button type="button" className="site-search-result" onClick={goToMenu}>
                                        <img src={product.imageUrl} alt={product.name} />
                                        <span className="site-search-result-info">
                                            <strong>{product.name}</strong>
                                            <span className="site-search-result-category">{product.categoryName}</span>
                                        </span>
                                        <span className="site-search-result-price">
                                            {Number(product.price).toLocaleString("tr-TR")} ₺
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SiteSearch;
