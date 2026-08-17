import "./Dashboard.css";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TablePickerModal from "../components/TablePickerModal";

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

    const [isTableModalOpen, setIsTableModalOpen] = useState(false);


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


    // =========================================================
    // GÖRSEL YARDIMCI DEĞERLER (mevcut state'lerden türetilir)
    // =========================================================

    // Sipariş hacmi grafiğinde son barı (bugün) vurgulamak için.
    const dailyEntries = Object.entries(dailyTotals);

    // Masa kartında dolu/toplam formatı için.
    const occupiedTablesCount = tables.filter(
        (table) => !table.available
    ).length;

    // Popüler ürün ikonunu kategoriye göre seçiyoruz.
    const categoryIcon = (categoryName) => {

        switch (categoryName) {
            case "Burgerler": return "lunch_dining";
            case "Pizzalar": return "local_pizza";
            case "Makarnalar": return "ramen_dining";
            case "İçecekler": return "local_bar";
            case "Tatlılar": return "cake";
            case "Sıcak İçecekler": return "local_cafe";
            default: return "restaurant";
        }

    };


    return (

        <Layout navbarType="dashboard" title="Kontrol Paneli">

        <div className="dashboard">


                {/* =================================================
                    SAYFA BAŞLIĞI
                ================================================= */}

                <div className="dashboard-header">

                    <h1>
                        Günaydın, Yönetici
                    </h1>

                    <p>
                        OTAĞ'da bugün olanlara genel bakış.
                    </p>

                </div>


                {/* =================================================
                    STAT CARDS
                ================================================= */}

                <div className="stats-container">


                    {/* TOPLAM SİPARİŞ */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <h3 className="stat-label">
                                Toplam Sipariş
                            </h3>

                            <span className="material-symbols-outlined stat-icon">
                                receipt
                            </span>

                        </div>

                        <p className="stat-value">
                            {orders.length}
                        </p>

                    </div>


                    {/* BEKLEYEN SİPARİŞLER */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <h3 className="stat-label">
                                Bekleyen
                            </h3>

                            <span className="material-symbols-outlined stat-icon">
                                schedule
                            </span>

                        </div>

                        <p className="stat-value">
                            {
                                orders.filter(
                                    order =>
                                        order.status === "WAITING"
                                ).length
                            }
                        </p>

                    </div>


                    {/* HAZIRLANAN SİPARİŞLER */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <h3 className="stat-label">
                                Hazırlanıyor
                            </h3>

                            <span className="material-symbols-outlined stat-icon">
                                skillet
                            </span>

                        </div>

                        <p className="stat-value">
                            {
                                orders.filter(
                                    order =>
                                        order.status === "PREPARING"
                                ).length
                            }
                        </p>

                    </div>


                    {/* HAZIR SİPARİŞLER */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <h3 className="stat-label">
                                Hazır
                            </h3>

                            <span className="material-symbols-outlined stat-icon">
                                room_service
                            </span>

                        </div>

                        <p className="stat-value">
                            {
                                orders.filter(
                                    order =>
                                        order.status === "READY"
                                ).length
                            }
                        </p>

                    </div>


                    {/* TOPLAM ÜRÜN */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <h3 className="stat-label">
                                Ürünler
                            </h3>

                            <span className="material-symbols-outlined stat-icon">
                                inventory_2
                            </span>

                        </div>

                        <p className="stat-value">
                            {products.length}
                        </p>

                    </div>


                    {/* TOPLAM MASA */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <h3 className="stat-label">
                                Masalar
                            </h3>

                            <span className="material-symbols-outlined stat-icon">
                                table_bar
                            </span>

                        </div>

                        <p className="stat-value">
                            {occupiedTablesCount}
                            <span className="stat-value-sub">
                                /{tables.length}
                            </span>
                        </p>

                    </div>


                    {/* KULLANICILAR */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <h3 className="stat-label">
                                Kullanıcılar
                            </h3>

                            <span className="material-symbols-outlined stat-icon">
                                group
                            </span>

                        </div>

                        <p className="stat-value">
                            0
                        </p>

                    </div>

                </div>


                {/* =================================================
                    ANA GRID (Sol: grafikler + siparişler, Sağ: masa + popüler)
                ================================================= */}

                <div className="dashboard-grid">


                    <div className="dashboard-main">


                        {/* =========================================
                            GRAFİKLER
                        ========================================= */}

                        <div className="charts-row">


                            {/* SİPARİŞ HACMİ */}

                            <div className="dashboard-card order-volume">

                                <h3 className="card-title">
                                    Sipariş Hacmi (7 Gün)
                                </h3>

                                <div className="bar-chart">

                                    {
                                        dailyEntries.map(
                                            ([day, total], index) => {

                                                // Günün satış tutarını,
                                                // en yüksek güne göre yüzdeye çeviriyoruz.
                                                const height =
                                                    (total / maxTotal) * 100;

                                                // Son eleman bugüne ait.
                                                const isToday =
                                                    index === dailyEntries.length - 1;

                                                return (

                                                    <div
                                                        className={`bar ${isToday ? "today" : ""}`}
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


                            {/* SİPARİŞ DURUMU */}

                            <div className="dashboard-card order-status">

                                <h3 className="card-title">
                                    Sipariş Durumu
                                </h3>

                                <div className="donut-wrap">

                                    <div className="donut">

                                        <div className="donut-arc donut-arc-a"></div>
                                        <div className="donut-arc donut-arc-b"></div>

                                        <div className="donut-center">

                                            <strong>
                                                {orders.length}
                                            </strong>

                                            <span>
                                                TOPLAM
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =========================================
                            SON SİPARİŞLER
                        ========================================= */}

                        <div className="dashboard-card recent-orders">

                            <div className="card-header">

                                <h3 className="card-title">
                                    Son Siparişler
                                </h3>

                                <button className="view-all-button">
                                    TÜMÜNÜ GÖR
                                </button>

                            </div>

                            <div className="orders-table-wrap">

                                <table className="orders-table">

                                    <thead>

                                        <tr>
                                            <th>Sipariş ID</th>
                                            <th>Tarih &amp; Saat</th>
                                            <th>Durum</th>
                                            <th className="text-right">Toplam</th>
                                        </tr>

                                    </thead>

                                    <tbody>

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

                                                    <tr key={order.id}>

                                                        <td className="order-id">
                                                            #{order.id}
                                                        </td>

                                                        <td className="order-date">
                                                            {formattedDate}, {formattedTime}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={
                                                                    `status ${statusClass}`
                                                                }
                                                            >
                                                                <span className="status-dot"></span>
                                                                {statusText}
                                                            </span>
                                                        </td>

                                                        <td className="text-right order-total">
                                                            ₺
                                                            {
                                                                order.total
                                                                    ?.toLocaleString(
                                                                        "tr-TR"
                                                                    )
                                                            }
                                                        </td>

                                                    </tr>

                                                );

                                            })
                                        }

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>


                    <div className="dashboard-side">


                        {/* =========================================
                            MASA DURUMU
                        ========================================= */}

                        <div className="dashboard-card table-status">

                            <div className="card-header">

                                <h3 className="card-title">
                                    Masa Durumu
                                </h3>

                                <span className="material-symbols-outlined">
                                    grid_view
                                </span>

                            </div>


                            <div className="table-grid">
                                {tables.slice(0, 4).map((table) => (
                                    <div
                                        className={`table-box ${table.available ? "available" : "occupied"}`}
                                        key={table.id}
                                    >
                                        <strong>{table.tableNumber}</strong>
                                        <span>
                                            <span className="table-dot"></span>
                                            {table.available ? "Müsait" : "Dolu"}
                                        </span>
                                        <small>{table.capacity} Kişilik</small>
                                    </div>
                                ))}
                            </div>

                            {tables.length > 4 && (
                                <button
                                    className="map-button"
                                    onClick={() => setIsTableModalOpen(true)}
                                >
                                    TÜM HARİTAYI GÖR
                                </button>
                            )}


                        </div>


                        {/* =========================================
                            POPÜLER ÜRÜNLER
                        ========================================= */}

                        <div className="dashboard-card popular-items">

                            <div className="card-header">

                                <h3 className="card-title">
                                    Popüler Ürünler
                                </h3>

                                <span className="material-symbols-outlined">
                                    star
                                </span>

                            </div>


                            <ul className="popular-list">

                                {/* Backend'den hesaplanan
                                    en popüler 5 ürünü gösteriyoruz. */}

                                {
                                    popularProducts.map((product, index) => (

                                        <li
                                            className="popular-item"
                                            key={product.id}
                                        >

                                            <div className="item-icon">
                                                <span className="material-symbols-outlined">
                                                    {categoryIcon(product.categoryName)}
                                                </span>
                                            </div>


                                            <div className="item-info">

                                                <strong>
                                                    {product.name}
                                                </strong>

                                                <span>
                                                    {product.categoryName}
                                                </span>

                                            </div>


                                            <div className="item-meta">

                                                <strong>
                                                    ₺{product.price}
                                                </strong>

                                                {index === 0 && (
                                                    <span className="item-tag">
                                                        ÇOK SATIYOR
                                                    </span>
                                                )}

                                            </div>

                                        </li>

                                    ))
                                }

                            </ul>


                            {/* Satış verisi yoksa kullanıcıya bilgi veriyoruz. */}

                            {
                                popularProducts.length === 0 && (

                                    <p className="empty-state-text">
                                        Henüz satış verisi bulunmuyor.
                                    </p>

                                )
                            }

                        </div>

                    </div>

                </div>

        </div>

        <TablePickerModal
            open={isTableModalOpen}
            onClose={() => setIsTableModalOpen(false)}
            tables={tables}
            title="Tüm Masalar"
        />

        </Layout>

    );

}

export default Dashboard;