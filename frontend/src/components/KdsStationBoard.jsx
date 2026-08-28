import {useEffect,useState} from "react";
import "./KdsStationBoard.css"
import  {
    KDS_STATUS,
    KDS_STATUS_LABELS,
    KDS_NEXT_STATUS
} from "../data/mockKdsOrders.js";

const FILTERS = [
    {value:"ALL",label:"Tümü"},
    {value:KDS_STATUS.WAITING,label: "Bekleyen"},
    {value: KDS_STATUS.PREPARING,label: "Hazırlanıyor"},
    {value:KDS_STATUS.READY,label: "Hazır"},
    {value: KDS_STATUS.CANCELLED,label: "İptal"}
];

function autheaders(){
    return{
        Authorization:`Bearer ${localStorage.getItem("token")}`,
    };
}
function formatTime(dateString){
    if(!dateString){
        return"--:--";
    }
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return "--:--";
    }
    return date.toLocaleTimeString("tr-TR",{
        hour:"2-digit",
        minute:"2-digit"
    });
}
function getElapsedMinutes(dateString){
    if(!dateString){
        return 0;
    }

    const created = new Date(dateString);
    if(Number.isNaN(created.getTime())){
        return 0
    }
    return Math.max(
        0,
        Math.floor((Date.now()-created.getTime())/60000)
    );
}
function isDelayed(status, dateString) {
    if (!dateString) {
        return false;
    }

    if (
        status === KDS_STATUS.READY ||
        status === KDS_STATUS.CANCELLED
    ) {
        return false;
    }

    return getElapsedMinutes(dateString) >= 20;
}

function KdsStationBoard({
    station,
    finalStatus,
    showDelayed,
    showNotes = false,
    showMix = false,
    pageTitle,
    pageSubtitle,
    emptyStateText
}){

    const [orderItems,setOrderItems] = useState([]);
    const [statusFilter,setStatusFilter] = useState("ALL");
    const [activeTicket,setActiveTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadOrderItems = async () =>{
        try{
            setError(null);
            const response = await fetch ("http://localhost:8080/order-items",
                {
                    headers:autheaders()
                });
            if (!response.ok){
                throw new Error("Sipariş ürünleri alınamadı.");
            }
            const data  = await response.json();
            setOrderItems(Array.isArray(data)?data:[]);
        }catch (error){
            console.error("Kds order items load error:",error);
            setError("KDS siparişleri yüklenemedi. Backend bağlantısını kontrol edin.");
        }finally {
            setLoading(false);
        }
    };
    useEffect(()=>{
        loadOrderItems();
        const interval = setInterval(()=>{
            loadOrderItems();
        },10000);
        return () => clearInterval(interval);
    },[]);
    const stationItems = orderItems.filter(
        (item) => item.station === station
    );

    const normalizedItems = stationItems.map((item)=>({
        ...item,
        status:item.status ?? KDS_STATUS.WAITING,
    }));

    const filteredItems = normalizedItems.filter(
        (item) =>
            statusFilter ==="ALL"||item.status===statusFilter
    );

    const waitingCount = normalizedItems.filter(
        (item) => item.status === KDS_STATUS.WAITING
    ).length;

    const preparingCount = normalizedItems.filter(
        (item) => item.status === KDS_STATUS.PREPARING
    ).length;
    const readyCount = normalizedItems.filter(
        (item) => item.status === KDS_STATUS.READY
    ).length;
    const cancelledCount = normalizedItems.filter(
        (item) => item.status === KDS_STATUS.CANCELLED
    ).length;
    const delayedCount = normalizedItems.filter(
        (item) =>
            isDelayed(item.status, item.orderDate)
    ).length;

    const updateTicketStatus = async (itemId,nextStatus) => {
        try{
            const response = await fetch(
                `http://localhost:8080/order-items/${itemId}/status?status=${nextStatus}`,
                {
                    method:"PUT",
                    headers:autheaders(),
                }
            );
            if (!response.ok){
                throw new Error("Sipariş durumu güncellenmedi.");
            }
            const updatedItem = await response.json();
            setOrderItems((prev)=>
            prev.map((item)=>
            item.id===itemId ? updatedItem : item
                )
            );
            setActiveTicket((current) => {
                if (
                    current &&
                    current.id === itemId
                ) {
                    return updatedItem;
                }
                return current;
            });
        }catch (error){
            console.error("KDS status update error:", error);
            alert(
                "Sipariş durumu güncellenirken bir hata oluştu."
            );
        }
    };
    const handleAdvance = async (event, item) => {
        event.stopPropagation();
        const currentStatus =
            item.status ?? KDS_STATUS.WAITING;
        const nextStatus =
            KDS_NEXT_STATUS[currentStatus];
        if (!nextStatus) {
            return;
        }
        await updateTicketStatus(
            item.id,
            nextStatus
        );
    };
    const handleCancel = async (event, item) => {
        event.stopPropagation();
        const confirmed = window.confirm(
            `Sipariş #${item.orderId} ürünü iptal edilsin mi?`
        );
        if (!confirmed) {
            return;
        }
        await updateTicketStatus(
            item.id,
            KDS_STATUS.CANCELLED
        );
    };
    return (
        <div className="kds-page">

            <div className="kds-page-header">
                <div>
                    <h1>{pageTitle}</h1>
                    <p>{pageSubtitle}</p>
                </div>
            </div>


            {/* =====================================================
                ÖZET
            ===================================================== */}

            <div
                className={`kds-summary ${
                    showDelayed
                        ? ""
                        : "kds-summary-no-delay"
                }`}
            >

                <div className="kds-summary-card">

                    <div className="kds-summary-top">
                        <span>Bekleyen</span>

                        <span className="material-symbols-outlined">
                            pending_actions
                        </span>
                    </div>

                    <div className="kds-summary-value">
                        {waitingCount}
                    </div>

                </div>


                <div className="kds-summary-card kds-summary-preparing">

                    <div className="kds-summary-top">
                        <span>Hazırlanıyor</span>

                        <span className="material-symbols-outlined">
                            local_fire_department
                        </span>
                    </div>

                    <div className="kds-summary-value">
                        {preparingCount}
                    </div>

                </div>


                <div className="kds-summary-card kds-summary-ready">

                    <div className="kds-summary-top">
                        <span>Hazır</span>

                        <span className="material-symbols-outlined">
                            check_circle
                        </span>
                    </div>

                    <div className="kds-summary-value">
                        {readyCount}
                    </div>

                </div>


                {showDelayed ? (

                    <div className="kds-summary-card kds-summary-danger">

                        <div className="kds-summary-top">
                            <span>Geciken</span>

                            <span className="material-symbols-outlined">
                                timer_off
                            </span>
                        </div>

                        <div className="kds-summary-value">
                            {delayedCount}
                        </div>

                    </div>

                ) : (

                    <div className="kds-summary-card kds-summary-danger">

                        <div className="kds-summary-top">
                            <span>İptal</span>

                            <span className="material-symbols-outlined">
                                cancel
                            </span>
                        </div>

                        <div className="kds-summary-value">
                            {cancelledCount}
                        </div>

                    </div>

                )}

            </div>


            {/* =====================================================
                FİLTRELER
            ===================================================== */}

            <div className="kds-filters">

                {FILTERS.map((filter) => (

                    <button
                        key={filter.value}
                        className={`kds-filter-chip ${
                            statusFilter === filter.value
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setStatusFilter(filter.value)
                        }
                    >
                        {filter.label}
                    </button>

                ))}

            </div>


            {/* =====================================================
                LOADING
            ===================================================== */}

            {loading && (

                <div className="kds-empty-state">

                    <span className="material-symbols-outlined">
                        progress_activity
                    </span>

                    <p>
                        Siparişler yükleniyor...
                    </p>

                </div>

            )}


            {/* =====================================================
                ERROR
            ===================================================== */}

            {!loading && error && (

                <div className="kds-empty-state">

                    <span className="material-symbols-outlined">
                        error
                    </span>

                    <p>{error}</p>

                    <button
                        className="kds-advance-button"
                        onClick={loadOrderItems}
                    >
                        Tekrar Dene
                    </button>

                </div>

            )}


            {/* =====================================================
                BOŞ
            ===================================================== */}

            {!loading &&
                !error &&
                normalizedItems.length === 0 && (

                    <div className="kds-empty-state">

                        <span className="material-symbols-outlined">
                            receipt_long
                        </span>

                        <p>{emptyStateText}</p>

                    </div>

                )}


            {!loading &&
                !error &&
                normalizedItems.length > 0 &&
                filteredItems.length === 0 && (

                    <div className="kds-empty-state">

                        <span className="material-symbols-outlined">
                            filter_alt_off
                        </span>

                        <p>
                            Bu filtreye uygun sipariş bulunamadı.
                        </p>

                    </div>

                )}


            {/* =====================================================
                KDS KARTLARI
            ===================================================== */}

            {filteredItems.length > 0 && (

                <div className="kds-ticket-grid">

                    {filteredItems.map((item) => {

                        const status =
                            item.status ??
                            KDS_STATUS.WAITING;

                        const delayed =
                            showDelayed &&
                            isDelayed(
                                status,
                                item.orderDate
                            );

                        const isCancelled =
                            status === KDS_STATUS.CANCELLED;

                        const isFinal =
                            status === finalStatus;

                        const elapsed =
                            getElapsedMinutes(
                                item.orderDate
                            );


                        const cardClass = [
                            "kds-ticket",

                            isCancelled
                                ? "kds-ticket-cancelled"
                                : "",

                            delayed && !isCancelled
                                ? "kds-ticket-delayed"
                                : "",

                            !delayed &&
                            !isCancelled &&
                            status === KDS_STATUS.PREPARING
                                ? "kds-ticket-preparing"
                                : "",

                        ]
                            .filter(Boolean)
                            .join(" ");


                        return (

                            <article
                                className={cardClass}
                                key={item.id}
                                onClick={() =>
                                    setActiveTicket(item)
                                }
                            >

                                <div className="kds-ticket-header">

                                    <div>

                                        <span className="kds-ticket-order">
                                            #{item.orderId}
                                        </span>

                                        <span className="kds-ticket-table">
                                            Sipariş
                                        </span>

                                    </div>


                                    <div className="kds-ticket-time">

                                        {!isCancelled &&
                                            !isFinal && (

                                                <span
                                                    className={`kds-ticket-elapsed ${
                                                        delayed
                                                            ? "danger"
                                                            : ""
                                                    }`}
                                                >

                                                    {delayed && (

                                                        <span className="material-symbols-outlined">
                                                            warning
                                                        </span>

                                                    )}

                                                    {elapsed} dk

                                                </span>

                                            )}

                                        <span className="kds-ticket-clock">
                                            {formatTime(
                                                item.orderDate
                                            )}
                                        </span>

                                    </div>

                                </div>


                                <div className="kds-ticket-body">

                                    <ul className="kds-ticket-items">

                                        <li>

                                            <span className="kds-item-qty">
                                                {item.quantity}x
                                            </span>

                                            <div className="kds-item-info">

                                                <p className="kds-item-name">
                                                    {item.productName}
                                                </p>


                                                {showNotes &&
                                                    item.note && (

                                                        <p className="kds-item-note">
                                                            Not: {item.note}
                                                        </p>

                                                    )}

                                            </div>

                                        </li>

                                    </ul>

                                </div>


                                <div className="kds-ticket-footer">

                                    {isCancelled && (

                                        <span className="kds-ticket-status-label cancelled">

                                            <span className="material-symbols-outlined">
                                                block
                                            </span>

                                            {KDS_STATUS_LABELS.CANCELLED}

                                        </span>

                                    )}


                                    {!isCancelled &&
                                        isFinal && (

                                            <span className="kds-ticket-status-label done">

                                                <span className="material-symbols-outlined">
                                                    check_circle
                                                </span>

                                                {
                                                    KDS_STATUS_LABELS[
                                                        finalStatus
                                                        ]
                                                }

                                            </span>

                                        )}


                                    {!isCancelled &&
                                        !isFinal && (

                                            <>

                                                <button
                                                    className="kds-cancel-button"
                                                    onClick={(event) =>
                                                        handleCancel(
                                                            event,
                                                            item
                                                        )
                                                    }
                                                >
                                                    İptal Et
                                                </button>


                                                <button
                                                    className="kds-advance-button"
                                                    onClick={(event) =>
                                                        handleAdvance(
                                                            event,
                                                            item
                                                        )
                                                    }
                                                >
                                                    {
                                                        KDS_STATUS_LABELS[
                                                            KDS_NEXT_STATUS[
                                                                status
                                                                ]
                                                            ]
                                                    }
                                                </button>

                                            </>

                                        )}

                                </div>

                            </article>

                        );

                    })}

                </div>

            )}


            {/* =====================================================
                DETAY DRAWER
            ===================================================== */}

            {activeTicket && (

                <div
                    className="kds-drawer-backdrop"
                    onClick={() =>
                        setActiveTicket(null)
                    }
                >

                    <div
                        className="kds-drawer"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="kds-drawer-header">

                            <div>

                                <h3>
                                    Sipariş #
                                    {activeTicket.orderId}
                                </h3>

                                <p>
                                    {activeTicket.productName}
                                </p>

                            </div>


                            <button
                                className="kds-drawer-close"
                                onClick={() =>
                                    setActiveTicket(null)
                                }
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>

                        </div>


                        <div className="kds-drawer-status">

                            <span
                                className={`kds-status-badge status-${(
                                    activeTicket.status ??
                                    KDS_STATUS.WAITING
                                ).toLowerCase()}`}
                            >

                                <span className="dot"></span>

                                {
                                    KDS_STATUS_LABELS[
                                    activeTicket.status ??
                                    KDS_STATUS.WAITING
                                        ]
                                }

                            </span>

                        </div>


                        <div className="kds-drawer-items">

                            <div className="kds-drawer-item">

                                <div className="kds-drawer-item-top">

                                    <strong>
                                        {activeTicket.productName}
                                    </strong>

                                    <span>
                                        {activeTicket.quantity} adet
                                    </span>

                                </div>


                                {showNotes &&
                                    activeTicket.note && (

                                        <p className="kds-drawer-item-note">
                                            Not:{" "}
                                            {activeTicket.note}
                                        </p>

                                    )}

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}
export default KdsStationBoard;