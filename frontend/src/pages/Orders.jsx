import { useEffect,useState } from "react";
//React'da değişen verileri tutmak için
import { useNavigate } from "react-router-dom";
import "./Orders.css";
import Layout from "../components/Layout";

const STATUS_OPTIONS = ["WAITING", "PREPARING", "READY", "DELIVERED", "CANCELLED"];
const ITEMS_PER_PAGE = 3;




// =========================================================
// YARDIMCI FONKSİYONLAR
// =========================================================


//SAAT FORMATLAMA İŞLEMLERİ
function formatOrderDate(date) {

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const time = date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    if (isToday) {
        return `Bugün, ${time}`;
    }

    const day = date.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short"
    });

    return `${day}, ${time}`;

}

//TARİH FORMATI KULLANMA İŞLEMLERİ
function toInputDateValue(date) {

    const year = date.getFullYear(); //Tarihten yılı alma işlemi
    const month = String(date.getMonth() + 1).padStart(2, "0");
    //date.getMonth() ayları 0'dan başlatır +1 alır,padStart iki karakter olmasını sağlar.
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function formatCurrency(amount) {

    if (amount === null || amount === undefined) {
        return "₺0,00";
    }

    return `₺${amount.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,//En az ondalık 2 basamak göster
        maximumFractionDigits: 2//En fazla ondalık 2 basamak göster
    })}`;

}


function Orders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);//orders:siparişlerin kendisi,setOrders -> değerini değiştirmek için kullandığımız fonksiyon.
    useEffect(() => {
        fetch("http://localhost:8080/orders")
            .then((response)=>{
                if(!response.ok){
                    throw new Error("Siparişler alınamadı.");
                }
                return response.json();
            })
            .then((data)=>{
                setOrders(data);
            })
            .catch((error)=>{
                console.error("Orders API Errror",error)
            });
    }, []);

    const [search, setSearch] = useState("");//Arama kutusu için
    const [statusFilter, setStatusFilter] = useState("ALL");//Durum filtresi tutuyor
    const [dateFilter, setDateFilter] = useState("");//Tarih filtresi tutar
    const [currentPage, setCurrentPage] = useState(1);//Hangi sayfada olduğumuzu tutar


    // =====================================================
    // FİLTRELEME
    // =====================================================

    const filteredOrders = orders.filter((order) => {
    //orders içerisindeki siparişleri tek tek kontrol et ve şartlara uyanları yeni bir listeye koy.
        const term = search.trim().toLowerCase();
        //trim->baş ve son boşlukları kaldır.

        const matchesSearch =
            term === "" ||
            String(order.id).includes(term);
            //id yazıya çevir ve içinde aradığımız şey var mı bakıyoruz.

        const matchesStatus =
            statusFilter === "ALL" ||
            order.status === statusFilter;

        const matchesDate =
            dateFilter === "" ||
            toInputDateValue(new Date(order.orderDate)) === dateFilter;

        return matchesSearch && matchesStatus && matchesDate;

    });


    // =====================================================
    // SAYFALAMA
    // =====================================================

    const totalItems = filteredOrders.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);

    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const pageOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const rangeStart = totalItems === 0 ? 0 : startIndex + 1;
    const rangeEnd = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);


    // =====================================================
    // OLAY YÖNETİCİLERİ
    // =====================================================

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    //Kullanıcı search input'a bir şey yazdığında bu fonksiyon çalışacak.
    //Arama yapınca tekrar 1. sayfaya dön.Arama sonucu sadece 1 sayfa kaldıysa 5. sayfada kalması saçma olur.

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleDateChange = (event) => {
        setDateFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleClear = () => {
        setSearch("");
        setStatusFilter("ALL");
        setDateFilter("");
        setCurrentPage(1);
    };

    const goToPrevPage = () => {
        setCurrentPage((page) => Math.max(1, page - 1));
    };

    const goToNextPage = () => {
        setCurrentPage((page) => Math.min(totalPages, page + 1));
    };

    const handleView = (order) => {
        alert(`Order #${order.id} details (coming soon).`);
    };

    const handleEdit = (order) => {
        alert(`Edit order #${order.id} (coming soon).`);
    };

    const handleNewOrder = () => {
        navigate("/orders/create");
    };

    const handleDelete = (order) => {

        const confirmed = window.confirm(`Delete order #${order.id}?`);

        if (!confirmed) {
            return;
        }

        setOrders((prev) =>
            prev.filter((item) => item.id !== order.id)
        );

    };


    return (

        <Layout navbarType="dashboard" title="Siparişler">

            <div className="orders-page">


                {/* =================================================
                    SAYFA BAŞLIĞI
                ================================================= */}

                <div className="orders-header">

                    <div>
                        <h1>Siparişler</h1>
                        <p>Restoran siparişlerini yönetin ve takip edin.</p>
                    </div>

                    <button className="new-order-button" onClick={handleNewOrder}>
                        <span className="material-symbols-outlined"></span>
                        Yeni Sipariş
                    </button>

                </div>


                {/* =================================================
                    FİLTRE + TABLO PANELİ
                ================================================= */}

                <div className="orders-panel">


                    {/* FİLTRELER */}

                    <div className="orders-filters">

                        <div className="filter-field filter-search">
                            <label htmlFor="order-search">Arama</label>
                            <div className="filter-search-input">
                                <span className="material-symbols-outlined">search</span>
                                <input
                                    id="order-search"
                                    type="text"
                                    placeholder="Sipariş Id ve Masalar"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>

                        <div className="filter-field">
                            <label htmlFor="order-status">Durum</label>
                            <select
                                id="order-status"
                                value={statusFilter}
                                onChange={handleStatusChange}
                            >
                                <option value="ALL">Tüm Durumlar</option>
                                {STATUS_OPTIONS.map((status) => (
                                    <option value={status} key={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-field">
                            <label htmlFor="order-date">Tarih</label>
                            <input
                                id="order-date"
                                type="date"
                                value={dateFilter}
                                onChange={handleDateChange}
                            />
                        </div>

                        <button className="clear-button" onClick={handleClear}>
                            Temizle
                        </button>

                    </div>


                    {/* TABLO */}

                    <div className="orders-table-wrap">

                        <table className="orders-table">

                            <thead>

                                <tr>
                                    <th>SİPARİŞ ID</th>
                                    <th>TARİH &amp; ZAMAN</th>
                                    <th>DURUM</th>
                                    <th className="text-right">TOPLAM MİKTAR</th>
                                    <th className="text-right">EYLEMLER</th>
                                </tr>

                            </thead>

                            <tbody>

                                {pageOrders.map((order) => (

                                    <tr key={order.id}>

                                        <td className="order-id">
                                            #{order.id}
                                        </td>

                                        <td className="order-date">
                                            {formatOrderDate(new Date(order.orderDate))}
                                        </td>

                                        <td>
                                            <span
                                                className={`status status-${order.status.toLowerCase()}`}
                                            >
                                                <span className="status-dot"></span>
                                                {order.status}
                                            </span>
                                        </td>

                                        <td className="text-right order-total">
                                            {formatCurrency(order.total)}
                                        </td>

                                        <td className="text-right">
                                            <div className="order-actions">

                                                <button
                                                    className="action-button"
                                                    title="View"
                                                    onClick={() => handleView(order)}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        visibility
                                                    </span>
                                                </button>

                                                <button
                                                    className="action-button"
                                                    title="Edit"
                                                    onClick={() => handleEdit(order)}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        edit
                                                    </span>
                                                </button>

                                                <button
                                                    className="action-button action-button-delete"
                                                    title="Delete"
                                                    onClick={() => handleDelete(order)}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        delete
                                                    </span>
                                                </button>

                                            </div>
                                        </td>

                                    </tr>

                                ))}

                                {pageOrders.length === 0 && (

                                    <tr>
                                        <td className="orders-empty" colSpan={5}>
                                            No orders match your filters.
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* SAYFALAMA */}

                    <div className="orders-pagination">

                        <span>
                            Showing {rangeStart}-{rangeEnd} of {totalItems} orders
                        </span>

                        <div className="pagination-buttons">

                            <button
                                onClick={goToPrevPage}
                                disabled={safePage <= 1}
                            >
                                Prev
                            </button>

                            <button
                                onClick={goToNextPage}
                                disabled={safePage >= totalPages}
                            >
                                Next
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </Layout>

    );

}

export default Orders;
