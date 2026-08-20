import { useEffect,useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; //Sayfayı değiştirmek için kullanılır.
import "./CreateOrder.css";
import Layout from "../../components/Layout.jsx";
import TablePickerModal from "../../components/TablePickerModal.jsx";

function formatCurrency(amount) {
    if (amount === undefined || amount === null) {
        return "₺0,00";
    }
    return `₺${amount.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Backend'deki location kodlarını (BAHCE/SALON) Türkçe etikete çeviriyoruz.
function formatLocation(location) {
    if (location === "BAHCE") {
        return "Bahçe";
    }
    if (location === "SALON") {
        return "Salon";
    }
    return location;
}

function CreateOrder() {

    const[tables,setTables]=useState([]);
    const[products,setProducts]=useState([]);
    const [categories,setCategories]=useState([]);
    const navigate = useNavigate();

    const fetchTables = async ()=>{
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/tables",{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(!response.ok){
            throw new Error("Masalar alınamadı")
        }
        const data = await response.json();
        setTables(data);
    };

    const fetchProducts = async ()=>{
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/products",{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(!response.ok){
            throw new Error("Ürünler alınamadı")
        }
        const data = await response.json();
        setProducts(data);
    };

    const fetchCategories = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/categories",{
            headers: {
                Authorization:`Bearer ${token}`
            }
        });
        if(!response.ok){
            throw new Error("Masalar alınamadı")
        }
        const data = await response.json();
        setCategories(data);
    };

    useEffect(() => {
        fetchTables();
        fetchProducts();            //Yeni sayfa açılır açılmaz -> GET istekleri gelir.
        fetchCategories();
    },[]);


    const [selectedTableId, setSelectedTableId] = useState(null);//Kullanıcının seçtiğimasa ıd'sini tut.
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);//PopUp açık mı?
    const [selectedCategory, setSelectedCategory] = useState("ALL");//Kategori ve arama ->Başlangıçta tüm ürünler
    const [productSearch, setProductSearch] = useState("");
    // cartItems: [{ productId, name, price, quantity, note }]
    const [cartItems, setCartItems] = useState([]);//Siparişe eklediğimiz ürünler burada tutuluyor.


    const handleSelectTable = (table) => {
        if (!table.available) {
            return;  //Masa doluysa hiçbir şey yapma
        }
        setSelectedTableId(table.id);
        setIsTableModalOpen(false); //Masanın id kaydet ve popup kapat
    };

    const selectedTable = tables.find(
        (table) => table.id === selectedTableId
    );


    const filteredProducts = useMemo(() => {

        const term = productSearch.trim().toLowerCase();

        return products.filter((product) => {

            const matchesCategory =
                selectedCategory === "ALL" ||
                product.categoryName === selectedCategory;

            const matchesSearch =
                term === "" ||
                product.name.toLowerCase().includes(term);

            return matchesCategory && matchesSearch;

        });

    }, [products,selectedCategory, productSearch]);


    // =====================================================
    // SEPET İŞLEMLERİ
    // =====================================================

    const handleAddProduct = (product) => {

        setCartItems((prev) => {

            const existing = prev.find(
                (item) => item.productId === product.id
            ); //Bu ürün zaten var mı?

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

    const handleCreateOrder = async () => {
        if(!canCreateOrder){
            return;
        }
        const orderPayload = {
            orderDate: new Date().toISOString(),
            status:"WAITING",
            total:total,
            tableId:selectedTable.id,
            items:cartItems.map((item) => ({
                productId:item.productId,
                quantity:item.quantity,
                note:item.note
            }))
        };

        try {
            const response = await fetch("http://localhost:8080/orders",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body:JSON.stringify(orderPayload)
            });
            if (!response.ok) {
                throw new Error("Sipariş oluşturulamadı.");
            }
            const createdOrder = await response.json();
            console.log("Oluşturulan sipariş:", createdOrder);
            alert(
                `Sipariş oluşturuldu.\n${selectedTable.tableNumber} — Toplam: ${formatCurrency(total)}`
            );

            // Masa hemen "Dolu" görünsün diye tabloları tazeliyoruz
            // (backend artık sipariş oluşunca table.available'ı false yapıyor).
            await fetchTables();

            navigate("/orders");

        } catch (error){
            console.error("Sipariş oluşturma hatası:",error)
            alert("Sipariş oluşturulurken bir hata oluştu.")
        }
    }


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

                        <div className="table-select-summary">

                            {selectedTable && (

                                <div className="table-select-info">

                                    <span className="table-select-info-number">
                                        {selectedTable.tableNumber}
                                    </span>

                                    <span className="table-select-info-seats">
                                        {selectedTable.capacity} Kişilik
                                    </span>

                                    <span className="table-select-info-location">
                                        {formatLocation(selectedTable.location)}
                                    </span>

                                    <span className="table-select-info-status">
                                        <span className="status-dot"></span>
                                        Seçili
                                    </span>

                                </div>

                            )}

                            <button
                                type="button"
                                className="table-select-button"
                                onClick={() => setIsTableModalOpen(true)}
                            >
                                <span className="material-symbols-outlined">table_restaurant</span>
                                {selectedTable ? "Masayı Değiştir" : "Masa Seç"}
                            </button>

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

                                <button
                                    key="ALL"
                                    type="button"
                                    className={`category-tab ${
                                        selectedCategory === "ALL" ? "active" : ""
                                    }`}
                                    onClick={() => setSelectedCategory("ALL")}
                                >
                                    Tüm Ürünler
                                </button>

                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        className={`category-tab ${
                                            selectedCategory === category.name ? "active" : ""
                                        }`}
                                        onClick={() => setSelectedCategory(category.name)}
                                    >
                                        {category.name}
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
                            {selectedTable ? selectedTable.tableNumber : "Masa seçilmedi"}
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

            <TablePickerModal
                open={isTableModalOpen}
                onClose={() => setIsTableModalOpen(false)}
                tables={tables}
                selectedTableId={selectedTableId}
                onSelect={handleSelectTable}
                title="Masa Seç"
            />

        </Layout>

    );

}

export default CreateOrder;
