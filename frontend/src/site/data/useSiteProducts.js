import { useEffect, useState } from "react";

const PRODUCTS_ENDPOINT = "http://localhost:8080/products";
const POPULAR_PRODUCTS_ENDPOINT = "http://localhost:8080/products/popular";

function deriveCategories(products) {
    const order = [];
    const byName = new Map();

    products.forEach((product) => {
        if (!product.categoryName) {
            return;
        }
        const existing = byName.get(product.categoryName);
        if (existing) {
            existing.itemCount += 1;
            return;
        }
        order.push(product.categoryName);
        byName.set(product.categoryName, {
            id: product.categoryName,
            name: product.categoryName,
            itemCount: 1,
            imageUrl: product.imageUrl
        });
    });

    return order.map((name) => byName.get(name));
}

export function useSiteProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(PRODUCTS_ENDPOINT);
                if (!response.ok) {
                    throw new Error("Ürünler alınamadı.");
                }
                const data = await response.json();
                if (!cancelled) {
                    setProducts(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Site ürünleri yüklenirken hata:", err);
                if (!cancelled) {
                    setError("Menü şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    return { products, categories: deriveCategories(products), loading, error };
}

export function useSitePopularProducts(limit = 4) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${POPULAR_PRODUCTS_ENDPOINT}?limit=${limit}`);
                if (!response.ok) {
                    throw new Error("Öne çıkan ürünler alınamadı.");
                }
                const data = await response.json();
                if (!cancelled) {
                    setProducts(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Popüler ürünler yüklenirken hata:", err);
                if (!cancelled) {
                    setError("Öne çıkan ürünler şu anda yüklenemiyor.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [limit]);

    return { products, loading, error };
}
