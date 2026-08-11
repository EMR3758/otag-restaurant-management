import "./Dashboard.css";
import { useEffect, useState } from "react";

function Dashboard() {

    // =========================================================
    // STATE'LER
    // =========================================================

    // Backend'den gelen ürünleri tutuyoruz.
    const [products, setProducts] = useState([]);

    // Backend'den gelen siparişleri tutuyoruz.
    const [orders, setOrders] = useState([]);

    // Siparişlerin içerisindeki ürün bilgilerini tutuyoruz.
    const [orderItems, setOrderItems] = useState([]);

    // Backend'den gelen restoran masalarını tutuyoruz.
    const [tables, setTables] = useState([]);

    const[showAllTables,setShowAllTables]=useState(false);


    // =========================================================
    // API VERİLERİNİ ÇEKME
    // =========================================================

    useEffect(() => {

        // Login sırasında localStorage'a kaydettiğimiz
        // JWT token'ı alıyoruz.
        const token = localStorage.getItem("token");


        // =====================================================
        // PRODUCTS API
        // =====================================================

        fetch("http://localhost:8080/products", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {

                console.log("Products:", data);

                // Backend'den gelen ürün listesini state'e kaydediyoruz.
                setProducts(data);

            })
            .catch(error => {

                console.error("Products Error:", error);

            });


        // =====================================================
        // ORDERS API
        // =====================================================

        fetch("http://localhost:8080/orders", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {

                console.log("Orders:", data);

                // Backend'den gelen sipariş listesini state'e kaydediyoruz.
                setOrders(data);

            })
            .catch(error => {

                console.error("Orders Error:", error);

            });


        // =====================================================
        // ORDER ITEMS API
        // =====================================================

        fetch("http://localhost:8080/order-items", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {

                console.log("Order Items:", data);

                // Sipariş içerisindeki ürün bilgilerini state'e kaydediyoruz.
                setOrderItems(data);

            })
            .catch(error => {

                console.error("Order Items Error:", error);

            });


        // =====================================================
        // RESTAURANT TABLES API
        // =====================================================

        // RestaurantTableController'daki endpoint:
        //
        // GET /restaurant-tables
        //
        // Masaları backend'den çekiyoruz.
        fetch("http://localhost:8080/tables", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log("TABLE STATUS:", response.status);
                return response.json();
            })
            .then(data => {
                console.log("TABLE DATA:", data);
                setTables(data);
            })
            .catch(error => console.error("TABLE ERROR:", error));
    }, []);


    // =========================================================
    // SİPARİŞ HACMİ - SON 7 GÜN
    // =========================================================

    // Her günün toplam satış tutarını tutacak obje.
    const dailyTotals = {};


    // Bugünün tarihini alıyoruz.
    const today = new Date();


    // Son 7 günü oluşturuyoruz.
    //
    // i = 6 → 6 gün önce
    // i = 0 → bugün
    for (let i = 6; i >= 0; i--) {

        const date = new Date(today);

        // Geçmiş güne gitmek için tarihi azaltıyoruz.
        date.setDate(today.getDate() - i);


        // Günün kısa Türkçe adını alıyoruz.
        const day = date.toLocaleDateString("tr-TR", {
            weekday: "short"
        });


        // Her günü başlangıçta 0 TL olarak tanımlıyoruz.
        dailyTotals[day] = 0;

    }


    // Backend'den gelen bütün siparişleri dolaşıyoruz.
    orders.forEach((order) => {

        // Sipariş tarihini JavaScript Date nesnesine çeviriyoruz.
        const orderDate = new Date(order.orderDate);


        // Sipariş ile bugün arasındaki gün farkını hesaplıyoruz.
        const difference = Math.floor(
            (today - orderDate) /
            (1000 * 60 * 60 * 24)
        );


        // Sipariş son 7 gün içerisindeyse
        // grafik hesabına dahil ediyoruz.
        if (difference >= 0 && difference <= 6) {

            // Siparişin ait olduğu günü buluyoruz.
            const day = orderDate.toLocaleDateString("tr-TR", {
                weekday: "short"
            });


            // O güne ait toplam satış tutarına
            // siparişin total değerini ekliyoruz.
            dailyTotals[day] += order.total || 0;

        }

    });


    // Grafikteki en yüksek satış tutarını buluyoruz.
    // Diğer barların yüksekliğini buna göre hesaplayacağız.
    const maxTotal = Math.max(
        ...Object.values(dailyTotals),
        1
    );


    // =========================================================
    // POPÜLER ÜRÜNLER
    // =========================================================

    // Her ürünün toplam kaç adet satıldığını hesaplıyoruz.
    const popularProducts = products

        .map((product) => {

            // Bu ürüne ait bütün OrderItem kayıtlarını buluyoruz.
            const totalQuantity = orderItems

                .filter(
                    (item) =>
                        item.productId === product.id
                )

                // Aynı ürüne ait quantity değerlerini topluyoruz.
                .reduce(
                    (total, item) =>
                        total + item.quantity,
                    0
                );


            // Ürünün mevcut bilgilerine
            // toplam satış adedini ekliyoruz.
            return {
                ...product,
                totalQuantity
            };

        })

        // Hiç satılmamış ürünleri göstermiyoruz.
        .filter(
            (product) =>
                product.totalQuantity > 0
        )

        // En çok satılan ürünü en üstte gösteriyoruz.
        .sort(
            (a, b) =>
                b.totalQuantity -
                a.totalQuantity
        )

        // Dashboard'da sadece ilk 5 ürünü gösteriyoruz.
        .slice(0, 5);


    return (

        <div className="dashboard">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="sidebar">

                <div className="logo-area">

                    <div className="logo-circle">
                        O
                    </div>

                    <div className="logo-text">

                        <h1>
                            OTAĞ
                        </h1>

                        <p>
                            Restaurant Yönetimi
                        </p>

                    </div>

                </div>


                <nav className="sidebar-menu">

                    <a
                        href="/dashboard"
                        className="menu-item active"
                    >

                        <span className="material-symbols-outlined">
                            dashboard
                        </span>

                        <span>
                            Kontrol Paneli
                        </span>

                    </a>


                    <a
                        href="#"
                        className="menu-item"
                    >

                        <span className="material-symbols-outlined">
                            receipt_long
                        </span>

                        <span>
                            Siparişler
                        </span>

                    </a>


                    <a
                        href="#"
                        className="menu-item"
                    >

                        <span className="material-symbols-outlined">
                            restaurant_menu
                        </span>

                        <span>
                            Menü
                        </span>

                    </a>


                    <a
                        href="#"
                        className="menu-item"
                    >

                        <span className="material-symbols-outlined">
                            category
                        </span>

                        <span>
                            Kategoriler
                        </span>

                    </a>


                    <a
                        href="#"
                        className="menu-item"
                    >

                        <span className="material-symbols-outlined">
                            table_restaurant
                        </span>

                        <span>
                            Masalar
                        </span>

                    </a>


                    <a
                        href="#"
                        className="menu-item"
                    >

                        <span className="material-symbols-outlined">
                            group
                        </span>

                        <span>
                            Kullanıcılar
                        </span>

                    </a>


                    <a
                        href="#"
                        className="menu-item"
                    >

                        <span className="material-symbols-outlined">
                            settings
                        </span>

                        <span>
                            Ayarlar
                        </span>

                    </a>

                </nav>


                <button className="logout-button">

                    <span className="material-symbols-outlined">
                        logout
                    </span>

                    <span>
                        ÇIKIŞ YAP
                    </span>

                </button>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="main-content">


                {/* =================================================
                    TOPBAR
                ================================================= */}

                <header className="topbar">

                    <div>

                        <h2>
                            Kontrol Paneli
                        </h2>

                        <p>
                            Restoran genel görünümü
                        </p>

                    </div>


                    <div className="topbar-right">

                        <span className="material-symbols-outlined">
                            notifications
                        </span>


                        <div className="user-info">

                            <strong>
                                Emirhan
                            </strong>

                            <span>
                                Yönetici
                            </span>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    DASHBOARD CONTENT
                ================================================= */}

                <section className="dashboard-content">


                    <h1>
                        Günaydın, Yönetici 👋
                    </h1>

                    <p>
                        OTAĞ'da bugün olanlara genel bakış.
                    </p>


                    {/* =================================================
                        STAT CARDS
                    ================================================= */}

                    <div className="stats-container">


                        {/* TOPLAM SİPARİŞ */}

                        <div className="stat-card">

                            <div>

                                <p>
                                    TOPLAM SİPARİŞ
                                </p>

                                <h3>
                                    {orders.length}
                                </h3>

                            </div>


                            <span className="material-symbols-outlined">
                                receipt_long
                            </span>

                        </div>


                        {/* BEKLEYEN SİPARİŞLER */}

                        <div className="stat-card">

                            <div>

                                <p>
                                    BEKLEYEN
                                </p>

                                <h3>

                                    {
                                        orders.filter(
                                            order =>
                                                order.status === "WAITING"
                                        ).length
                                    }

                                </h3>

                            </div>


                            <span className="material-symbols-outlined">
                                schedule
                            </span>

                        </div>


                        {/* HAZIRLANAN SİPARİŞLER */}

                        <div className="stat-card">

                            <div>

                                <p>
                                    HAZIRLANIYOR
                                </p>

                                <h3>

                                    {
                                        orders.filter(
                                            order =>
                                                order.status === "PREPARING"
                                        ).length
                                    }

                                </h3>

                            </div>


                            <span className="material-symbols-outlined">
                                restaurant
                            </span>

                        </div>


                        {/* HAZIR SİPARİŞLER */}

                        <div className="stat-card">

                            <div>

                                <p>
                                    HAZIR
                                </p>

                                <h3>

                                    {
                                        orders.filter(
                                            order =>
                                                order.status === "READY"
                                        ).length
                                    }

                                </h3>

                            </div>


                            <span className="material-symbols-outlined">
                                room_service
                            </span>

                        </div>


                        {/* TOPLAM ÜRÜN */}

                        <div className="stat-card">

                            <div>

                                <p>
                                    ÜRÜNLER
                                </p>

                                <h3>
                                    {products.length}
                                </h3>

                            </div>


                            <span className="material-symbols-outlined">
                                inventory_2
                            </span>

                        </div>


                        {/* TOPLAM MASA */}

                        <div className="stat-card">

                            <div>

                                <p>
                                    MASALAR
                                </p>

                                <h3>
                                    {tables.length}
                                </h3>

                            </div>


                            <span className="material-symbols-outlined">
                                table_restaurant
                            </span>

                        </div>


                        {/* KULLANICILAR */}

                        <div className="stat-card">

                            <div>

                                <p>
                                    KULLANICILAR
                                </p>

                                <h3>
                                    0
                                </h3>

                            </div>


                            <span className="material-symbols-outlined">
                                group
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        DASHBOARD GRID
                    ================================================= */}

                    <div className="dashboard-grid">


                        {/* =================================================
                            SİPARİŞ HACMİ
                        ================================================= */}

                        <div className="dashboard-card order-volume">

                            <div className="card-header">

                                <h3>
                                    Sipariş Hacmi (7 Gün)
                                </h3>

                            </div>


                            <div className="bar-chart">

                                {
                                    Object.entries(dailyTotals).map(
                                        ([day, total]) => {

                                            // Günün satış tutarını,
                                            // en yüksek güne göre yüzdeye çeviriyoruz.
                                            const height =
                                                (total / maxTotal) * 100;


                                            return (

                                                <div
                                                    className="bar"
                                                    style={{
                                                        height: `${height}%`
                                                    }}
                                                    key={day}
                                                >

                                                    <span>
                                                        {day}
                                                    </span>

                                                </div>

                                            );

                                        }
                                    )
                                }

                            </div>

                        </div>


                        {/* =================================================
                            SİPARİŞ DURUMU
                        ================================================= */}

                        <div className="dashboard-card order-status">

                            <div className="card-header">

                                <h3>
                                    Sipariş Durumu
                                </h3>

                            </div>


                            <div className="status-circle">

                                <strong>
                                    {orders.length}
                                </strong>

                                <span>
                                    TOPLAM
                                </span>

                            </div>

                        </div>


                        {/* =================================================
                            MASA DURUMU
                        ================================================= */}

                        <div className="dashboard-card table-status">

                            <div className="card-header">

                                <h3>
                                    Masa Durumu
                                </h3>

                                <span className="material-symbols-outlined">
                                    grid_view
                                </span>

                            </div>


                            <div className="table-grid">
                                {(showAllTables ? tables : tables.slice(0, 4)).map((table) => (
                                    <div
                                        className={`table-box ${table.available ? "available" : "occupied"}`}
                                        key={table.id}
                                    >
                                        <strong>{table.tableNumber}</strong>
                                        <span>{table.available ? "● Müsait" : "● Dolu"}</span>
                                        <small>{table.capacity} Kişilik</small>
                                    </div>
                                ))}
                            </div>

                            {tables.length > 4 && (
                                <button
                                    className="map-button"
                                    onClick={() => setShowAllTables(!showAllTables)}
                                >
                                    {showAllTables ? "DAHA AZ GÖR" : "TÜM HARİTAYI GÖR"}
                                </button>
                            )}


                        </div>

                    </div>


                </section>


                {/* =================================================
                    SON SİPARİŞLER + POPÜLER ÜRÜNLER
                ================================================= */}

                <div className="bottom-grid">


                    {/* =================================================
                        SON SİPARİŞLER
                    ================================================= */}

                    <div className="dashboard-card recent-orders">

                        <div className="card-header">

                            <h3>
                                Son Siparişler
                            </h3>


                            <button className="view-all-button">
                                TÜMÜNÜ GÖR
                            </button>

                        </div>


                        <div className="orders-table">


                            {/* TABLO BAŞLIKLARI */}

                            <div className="order-row order-header">

                                <span>
                                    SİPARİŞ ID
                                </span>

                                <span>
                                    TARİH
                                </span>

                                <span>
                                    ZAMAN
                                </span>

                                <span>
                                    DURUM
                                </span>

                                <span>
                                    TOTAL
                                </span>

                            </div>


                            {/* BACKEND'DEN GELEN SİPARİŞLER */}

                            {
                                orders.map((order) => {

                                    const date =
                                        new Date(order.orderDate);


                                    // Sipariş tarihini Türkçe okunabilir
                                    // bir formata çeviriyoruz.
                                    const formattedDate =
                                        date.toLocaleDateString(
                                            "tr-TR",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            }
                                        );


                                    // Sipariş saatini alıyoruz.
                                    const formattedTime =
                                        date.toLocaleTimeString(
                                            "tr-TR",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            }
                                        );


                                    // Backend'deki status değerini
                                    // kullanıcıya göstereceğimiz Türkçe
                                    // metne çeviriyoruz.
                                    let statusText = "";
                                    let statusClass = "";


                                    if (
                                        order.status === "WAITING"
                                    ) {

                                        statusText = "Bekliyor";
                                        statusClass = "pending";

                                    }

                                    else if (
                                        order.status === "PREPARING"
                                    ) {

                                        statusText = "Hazırlanıyor";
                                        statusClass = "preparing";

                                    }

                                    else if (
                                        order.status === "READY"
                                    ) {

                                        statusText = "Hazır";
                                        statusClass = "ready";

                                    }


                                    return (

                                        <div
                                            className="order-row"
                                            key={order.id}
                                        >

                                            <span>
                                                #{order.id}
                                            </span>

                                            <span>
                                                {formattedDate}
                                            </span>

                                            <span>
                                                {formattedTime}
                                            </span>


                                            <span
                                                className={
                                                    `status ${statusClass}`
                                                }
                                            >
                                                {statusText}
                                            </span>


                                            <span>
                                                ₺
                                                {
                                                    order.total
                                                        ?.toLocaleString(
                                                            "tr-TR"
                                                        )
                                                }
                                            </span>

                                        </div>

                                    );

                                })
                            }

                        </div>

                    </div>


                    {/* =================================================
                        POPÜLER ÜRÜNLER
                    ================================================= */}

                    <div className="dashboard-card popular-items">

                        <div className="card-header">

                            <h3>
                                Popüler Ürünler
                            </h3>

                            <span className="material-symbols-outlined">
                                star
                            </span>

                        </div>


                        {/* Backend'den hesaplanan
                            en popüler 5 ürünü gösteriyoruz. */}

                        {
                            popularProducts.map((product) => (

                                <div
                                    className="popular-item"
                                    key={product.id}
                                >

                                    <div className="item-icon">

                                        {
                                            product.categoryName === "Burgerler"
                                            && "🍔"
                                        }

                                        {
                                            product.categoryName === "Pizzalar"
                                            && "🍕"
                                        }

                                        {
                                            product.categoryName === "Makarnalar"
                                            && "🍝"
                                        }

                                        {
                                            product.categoryName === "İçecekler"
                                            && "🥤"
                                        }

                                        {
                                            product.categoryName === "Tatlılar"
                                            && "🍰"
                                        }

                                        {
                                            product.categoryName === "Sıcak İçecekler"
                                            && "☕"
                                        }

                                    </div>


                                    <div className="item-info">

                                        <strong>
                                            {product.name}
                                        </strong>

                                        <span>
                                            {product.totalQuantity} sipariş
                                        </span>

                                    </div>


                                    <strong>
                                        ₺{product.price}
                                    </strong>

                                </div>

                            ))
                        }


                        {/* Satış verisi yoksa kullanıcıya bilgi veriyoruz. */}

                        {
                            popularProducts.length === 0 && (

                                <p>
                                    Henüz satış verisi bulunmuyor.
                                </p>

                            )
                        }

                    </div>

                </div>

            </main>

        </div>

    );

}

export default Dashboard;