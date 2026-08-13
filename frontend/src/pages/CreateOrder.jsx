import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateOrder.css";
import Layout from "../components/Layout";
import { mockTables, mockProducts, PRODUCT_CATEGORIES } from "../mock/createOrderMockData";

function formatCurrency(amount) {

    return `₺${amount.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

}


function CreateOrder() {

    const navigate = useNavigate();


    // =====================================================
    // STATE'LER
    // =====================================================

    const [selectedTableId, setSelectedTableId] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [productSearch, setProductSearch] = useState("");

    // cartItems: [{ productId, name, price, quantity, note }]
    const [cartItems, setCartItems] = useState([]);


    // =====================================================
    // MASA SEÇİMİ
    // =====================================================

    const handleSelectTable = (table) => {

        if (table.status === "OCCUPIED") {
            return;
        }

        setSelectedTableId(table.id);

    };

    const selectedTable = mockTables.find(
        (table) => table.id === selectedTableId
    );


    // =====================================================
    // ÜRÜN LİSTESİ (kategori + arama filtresi)
    // =====================================================

    const filteredProducts = useMemo(() => {

        const term = productSearch.trim().toLowerCase();

        return mockProducts.filter((product) => {

            const matchesCategory =
                selectedCategory === "ALL" ||
                product.category === selectedCategory;

            const matchesSearch =
                term === "" ||
                product.name.toLowerCase().includes(term);

            return matchesCategory && matchesSearch;

        });

    }, [selectedCategory, productSearch]);


    // =====================================================
    // SEPET İŞLEMLERİ
    // =====================================================

    const handleAddProduct = (product) => {

        setCartItems((prev) => {

            const existing = prev.find(
                (item) => item.productId === product.id
            );

            if (existing) {

                return prev.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );

            }

            return [
                ...prev,
                {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    note: ""
                }
            ];

        });

    };


    const handleIncrease = (productId) => {

        setCartItems((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );

    };


    const handleDecrease = (productId) => {

        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                // Miktar 0'a inince ürünü sepetten kaldırıyoruz.
                .filter((item) => item.quantity > 0)
        );

    };


    const handleRemoveItem = (productId) => {

        setCartItems((prev) =>
            prev.filter((item) => item.productId !== productId)
        );

    };


    const handleNoteChange = (productId, note) => {

        setCartItems((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? { ...item, note }
                    : item
            )
        );

    };


    // =====================================================
    // TOPLAM
    // =====================================================

    const total = useMemo(() => {

        return cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

    }, [cartItems]);


    // =====================================================
    // İPTAL / SİPARİŞ OLUŞTUR
    // =====================================================

    const canCreateOrder = selectedTable && cartItems.length > 0;

    const handleCancel = () => {
        navigate("/orders");
    };

    const handleCreateOrder = () => {

        if (!canCreateOrder) {
            return;
        }

        // Backend hazır olduğunda burada POST /orders isteği atılacak.
        // Şimdilik payload'ı hazırlayıp konsola yazıyoruz.
        const orderPayload = {
            tableId: selectedTable.id,
            items: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                note: item.note
            })),
            total
        };

        console.log("Yeni sipariş (mock):", orderPayload);

        alert(`Sipariş oluşturuldu (mock).\n${selectedTable.label} — Toplam: ${formatCurrency(total)}`);

        navigate("/orders");

    };


    return (

        <Layout navbarType="dashboard" title="Yeni Sipariş">

            <div className="create-order-page">


                {/* =================================================
                    SOL SÜTUN — ADIMLAR
                ================================================= */}

                <div className="create-order-main">

                    <div className="create-order-header">
                        <h1>Yeni Sipariş</h1>
                        <p>Yeni bir restoran siparişi oluşturun.</p>
                    </div>


                    {/* =========================================
                        ADIM 1: MASA SEÇİMİ
                    ========================================= */}

                    <section className="order-section">

                        <h2 className="order-section-title">
                            Adım 1: Masa Seçimi
                        </h2>

                        <div className="table-select-grid">

                            {mockTables.map((table) => {

                                const isSelected = table.id === selectedTableId;
                                const isOccupied = table.status === "OCCUPIED";

                                return (

                                    <button
                                        key={table.id}
                                        type="button"
                                        className={`table-select-card ${
                                            isSelected ? "selected" : ""
                                        } ${isOccupied ? "occupied" : ""}`}
                                        onClick={() => handleSelectTable(table)}
                                        disabled={isOccupied}
                                    >

                                        <span className="table-select-label">
                                            {table.label.toUpperCase()}
                                        </span>

                                        <span className="table-select-seats">
                                            {table.seats} Kişilik
                                        </span>

                                        <span className="table-select-status">
                                            <span className="status-dot"></span>
                                            {isSelected
                                                ? "Seçili"
                                                : isOccupied
                                                    ? "Dolu"
                                                    : "Müsait"}
                                        </span>

                                    </button>

                                );

                            })}

                        </div>

                    </section>


                    {/* =========================================
                        ADIM 2: ÜRÜN EKLE
                    ========================================= */}

                    <section className="order-section">

                        <h2 className="order-section-title">
                            Adım 2: Ürün Ekle
                        </h2>

                        <div className="product-toolbar">

                            <div className="category-tabs">
                                {PRODUCT_CATEGORIES.map((category) => (
                                    <button
                                        key={category.value}
                                        type="button"
                                        className={`category-tab ${
                                            selectedCategory === category.value ? "active" : ""
                                        }`}
                                        onClick={() => setSelectedCategory(category.value)}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>

                            <div className="product-search">
                                <span className="material-symbols-outlined">search</span>
                                <input
                                    type="text"
                                    placeholder="Menüde ara..."
                                    value={productSearch}
                                    onChange={(event) => setProductSearch(event.target.value)}
                                />
                            </div>

                        </div>

                        <div className="product-grid">

                            {filteredProducts.map((product) => (

                                <div className="product-card" key={product.id}>

                                    <div className="product-card-info">
                                        <h4>{product.name}</h4>
                                        <p className="product-price">
                                            {formatCurrency(product.price)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="product-add-button"
                                        onClick={() => handleAddProduct(product)}
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>

                                </div>

                            ))}

                            {filteredProducts.length === 0 && (
                                <p className="product-empty">
                                    Aramanızla eşleşen ürün bulunamadı.
                                </p>
                            )}

                        </div>

                    </section>

                </div>


                {/* =================================================
                    SAĞ SÜTUN — MEVCUT SİPARİŞ
                ================================================= */}

                <aside className="current-order-panel">

                    <div className="current-order-header">

                        <h2>Mevcut Sipariş</h2>

                        <span className="current-order-table">
                            {selectedTable ? selectedTable.label : "Masa seçilmedi"}
                        </span>

                    </div>

                    <div className="current-order-items">

                        {cartItems.map((item) => (

                            <div className="cart-item" key={item.productId}>

                                <div className="cart-item-top">

                                    <div>
                                        <h4>{item.name}</h4>
                                        <p className="cart-item-unit-price">
                                            {formatCurrency(item.price)}
                                        </p>
                                    </div>

                                    <p className="cart-item-line-total">
                                        {formatCurrency(item.price * item.quantity)}
                                    </p>

                                </div>

                                <div className="cart-item-controls">

                                    <div className="quantity-stepper">

                                        <button
                                            type="button"
                                            onClick={() => handleDecrease(item.productId)}
                                        >
                                            <span className="material-symbols-outlined">remove</span>
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            type="button"
                                            onClick={() => handleIncrease(item.productId)}
                                        >
                                            <span className="material-symbols-outlined">add</span>
                                        </button>

                                    </div>

                                    <button
                                        type="button"
                                        className="cart-item-remove"
                                        title="Ürünü kaldır"
                                        onClick={() => handleRemoveItem(item.productId)}
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>

                                </div>

                                <input
                                    type="text"
                                    className="cart-item-note"
                                    placeholder="Not ekle (örn. soğansız)"
                                    value={item.note}
                                    onChange={(event) =>
                                        handleNoteChange(item.productId, event.target.value)
                                    }
                                />

                            </div>

                        ))}

                        {cartItems.length === 0 && (
                            <p className="cart-empty">
                                Henüz ürün eklenmedi.
                            </p>
                        )}

                    </div>

                    <div className="current-order-footer">

                        <div className="current-order-total">
                            <span>Toplam</span>
                            <strong>{formatCurrency(total)}</strong>
                        </div>

                        <div className="current-order-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={handleCancel}
                            >
                                İptal
                            </button>

                            <button
                                type="button"
                                className="create-button"
                                onClick={handleCreateOrder}
                                disabled={!canCreateOrder}
                            >
                                Sipariş Oluştur
                            </button>

                        </div>

                    </div>

                </aside>

            </div>

        </Layout>

    );

}

export default CreateOrder;
