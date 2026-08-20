//usestate -> sayfada değişicek verileri tuturız
//useEffect-> sayfa açıldığında backend'e istek atmak
//useMemo -> hesapladığımız verileri gereksiz yere tekrar hesaplamamak
import {useEffect,useMemo,useState} from "react";

//Link -> kullanıcıya tıklanabilir sayfa bağlantısı vermek
//useNavigate -> başka sayfaya yönlendirmek için
//useParams -> urldeki ıd almak için
import {useNavigate,useParams,Link} from "react-router-dom";

import "./OrderDetail.css"
import Layout from "../../components/Layout.jsx";
import DeleteConfirmModal from "../../components/DeleteConfirmModal.jsx";
import SplitItemModal from "../../components/SplitItemModal.jsx";

function formatCurrency(amount) {
    if (amount == null || amount == undefined || Number.isNaN(amount)) {
        return "₺0,00";
    }
    return `₺${Number(amount).toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function  formatOrderDateTime(dateValue){
    if(!dateValue){
        return "";
    }
    const date = new Date(dateValue);
    const now = new Date();
    //gelen tarihin geçerli olup olmadığını kontrol
    if(Number.isNaN(date.getTime())){
        return "";
    }

    const isToday = date.toDateString() === now.toDateString();
    const time = date.toLocaleTimeString("tr-TR",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:false
    });
    if (isToday) {
        return `Bugün, ${time}`;
    }
    const day = date.toLocaleDateString("tr-TR",{
        day: "2-digit",
        month: "short"
    });
    return `${day}, ${time}`;
}

const FLOW_STATUSES = ["WAITING","PREPARING","READY","DELIVERED"]
const STATUS_LABELS = {
    WAITING:"Bekliyor",
    PREPARING: "Hazırlanıyor",
    READY: "Hazır",
    DELIVERED: "Teslim Edildi",
    CANCELLED: "İptal Edildi"
}

const PAYMENT_METHOD_LABELS = {
    CARD: "Kart",
    CASH: "Nakit",
    OTHER: "Diğer"
}

function OrderDetail(){
    const {id} = useParams(); //id: "1048"
    const navigate = useNavigate();
    const orderId = Number(id);//orderId:1048

    //useState, component içinde değişebilen bir veriyi saklamak
    const[order,setOrder]=useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const[products,setProducts] = useState([]);

    //Bu sayfanın backend'den veri bekleyip beklemediğini tutuyor.
    const [loading, setLoading] = useState(true);
    //Hata oldu mu?
    const[loadError,setLoadError]=useState(null);
    const[isSavingStatus,setIsSavingStatus]=useState(false);

    //silme onay penceresinin açık olup olmadığını tutar
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    //silme işleminin backend'de devam edip etmediğini tutar
    const [isDeleting, setIsDeleting] = useState(false);

    //+ Ürün Ekle" formu açık mı kapalı mı?
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);

    //Eklemek istediğimiz ürünün Id'si
    const [newItemProductId, setNewItemProductId] = useState("");
    //Eklemek istediğimiz miktar için
    const [newItemQuantity, setNewItemQuantity] = useState(1);
    //Eklemek istediğimiz not kısmı
    const [newItemNote, setNewItemNote] = useState("");

    //Şuan ekleme yapılıyor mu kısmı
    const [isAddingItem, setIsAddingItem] = useState(false);

    // Ödeme durumu (Tek Kişi / Alman Usulü, kişiler, bölüştürmeler) backend'den gelir.
    const [payment, setPayment] = useState(null);
    // Ödeme aksiyonları (mod/method değişimi, kişi ekle/sil) sırasında butonları kilitlemek için.
    const [paymentBusy, setPaymentBusy] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const [expandedParticipants, setExpandedParticipants] = useState({});
    const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
    const [newParticipantName, setNewParticipantName] = useState("");
    const [isAddingParticipant, setIsAddingParticipant] = useState(false);

    // Bölüştür modalı açıkken hangi order item üzerinde çalışıldığını tutar.
    const [splitModalItem, setSplitModalItem] = useState(null);

    const [isCompletingPayment, setIsCompletingPayment] = useState(false);

    const authHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`
    })

    const fetchOrder = async () => {
        const response = await fetch(`http://localhost:8080/orders/${orderId}`,
            {
                headers: authHeaders()
            });
        if(!response.ok){
            throw new Error(("Sipariş alınamadı"));
        }
        const data = await response.json();
        return data;
    };
    const fetchOrderItems = async () => {
        const response = await fetch(
            "http://localhost:8080/order-items",
            {
                headers: authHeaders()
            }
        );
        if(!response.ok){throw new Error("Ürün maddeleri alınamadı.")}
        const data = await response.json();
        return data;
    };
    const fetchProducts = async () => {
        const response = await fetch(
            "http://localhost:8080/products",
            {
                headers: authHeaders()
            }
        );
        if(!response.ok){throw new Error("Ürünler alınamadı.")}
        const data = await response.json();
        return data;
    };
    const fetchPayment = async () => {
        const response = await fetch(
            `http://localhost:8080/orders/${orderId}/payment`,
            {
                headers: authHeaders()
            }
        );
        if(!response.ok){throw new Error("Ödeme bilgisi alınamadı.")}
        const data = await response.json();
        return data;
    };

    //Başla->loading:true -> 4 Apı çağrısı->başarılı mı?->evet state döndür,hayır error doldur->loading:false
    const loadAll = async () => {
        setLoading(true);
        setLoadError(null);

        try{
            const [orderData,itemsData,productsData,paymentData] = await Promise.all([
                fetchOrder(),
                fetchOrderItems(),
                fetchProducts(),
                fetchPayment()
            ]);

            setOrder(orderData ?? null);
            setOrderItems(itemsData ?? []);
            setProducts(productsData ?? []);
            setPayment(paymentData ?? null);
        }catch (error){
            console.error("Sipariş detayı yüklenirken hata:", error);
            setLoadError("Sipariş bilgileri yüklenemedi. Lütfen tekrar deneyin.");
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, [orderId]);

    // Bütün order-items listesinden sadece bu siparişe ait ürünleri ayıklama mantığı
    const itemsForThisOrder = useMemo(() => {

        return orderItems
            .filter((item) => item.orderId === orderId)
            .map((item) => {

                const product = products.find(
                    (candidate) => candidate.id === item.productId
                );

                const unitPrice = item.unitPrice ?? 0;
                const quantity = item.quantity ?? 0;

                return {
                    ...item,
                    productName: product?.name ?? `Ürün #${item.productId}`,
                    categoryName: product?.categoryName ?? "",
                    productImageUrl: product?.imageUrl ?? "",
                    subtotal: unitPrice * quantity
                };

            });

    }, [orderItems, products, orderId]);

    //Siparişi backend'den durumunu güncelleme
    const handleStatusChange = async (newStatus) => {
        if (!order || newStatus === order.status || isSavingStatus) {
            return;
        }
        setIsSavingStatus(true);
        try {
            const payload = {
                orderDate: order.orderDate,
                status: newStatus,
                total: order.total,
                tableId: order.table?.id,
                items: []
            };
            const response = await fetch(`http://localhost:8080/orders/${order.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error("Durum güncellenemedi");
            }
            const updatedOrder = await response.json();
            setOrder(updatedOrder);
        } catch (error) {
            console.error("Sipariş durumu güncellenirken hata:", error);
            alert("Sipariş durumu güncellenirken bir hata oluştu.");
        } finally {
            setIsSavingStatus(false);
        }

    };

    // Siparişi backend'den silme
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(
                `http://localhost:8080/orders/${orderId}`,
                {
                    method: "DELETE",
                    headers: authHeaders()
                }
            );
            if (!response.ok) {
                throw new Error("Sipariş silinemedi");
            }
            navigate("/orders");
        } catch (error) {
            console.error("Sipariş silinirken hata:", error);
            alert("Sipariş silinirken bir hata oluştu.");
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    //Siparişe yeni ürün ekleme
    const handleAddItem = async (event) => {
        event.preventDefault(); // form gönderilince sayfa yenilenmesin
        if(!newItemProductId){
            return;
        }
        setIsAddingItem(true);
        try{
            const response = await fetch("http://localhost:8080/order-items",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body:JSON.stringify({
                    orderId: order.id,
                    productId: Number(newItemProductId),
                    quantity: Number(newItemQuantity) || 1,
                    note: newItemNote
                })
            });
            if (!response.ok){
                throw new Error("Ürün eklenmedi");
            }
            const refreshedItems = await fetchOrderItems();
            setOrderItems(refreshedItems ?? []);
        }catch (error) {
            console.error("Ürün eklenirken hata:", error);
            alert("Ürün eklenirken bir hata oluştu.");

        } finally {
            setIsAddingItem(false);
        }
    }

    // =====================================================
    // ÖDEME
    // =====================================================

    // Belirli bir order item için hangi kişiye ne kadar bölüştürüldüğünü
    // payment state'inden (backend'den gelen gerçek veri) türetir.
    const allocationsForItem = (orderItemId) => {
        if (!payment) {
            return [];
        }
        const result = [];
        payment.participants.forEach((participant) => {
            const allocation = participant.allocations.find(
                (a) => a.orderItemId === orderItemId
            );
            if (allocation) {
                result.push({
                    participantId: participant.id,
                    participantName: participant.name,
                    ...allocation
                });
            }
        });
        return result;
    };

    const toggleParticipantExpanded = (participantId) => {
        setExpandedParticipants((prev) => ({
            ...prev,
            [participantId]: prev[participantId] === false
        }));
    };

    const handleModeChange = async (mode) => {
        if (!payment || payment.mode === mode || paymentBusy || payment.status === "PAID") {
            return;
        }
        setPaymentBusy(true);
        setPaymentError(null);
        try {
            const response = await fetch(`http://localhost:8080/orders/${orderId}/payment/mode`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify({ mode })
            });
            if (!response.ok) {
                throw new Error("Ödeme modu değiştirilemedi");
            }
            setPayment(await response.json());
        } catch (error) {
            console.error("Ödeme modu değiştirilirken hata:", error);
            setPaymentError("Ödeme modu değiştirilemedi.");
        } finally {
            setPaymentBusy(false);
        }
    };

    const handleSingleMethodSelect = async (method) => {
        if (!payment || paymentBusy || payment.status === "PAID") {
            return;
        }
        setPaymentBusy(true);
        setPaymentError(null);
        try {
            const response = await fetch(`http://localhost:8080/orders/${orderId}/payment/method`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify({ method })
            });
            if (!response.ok) {
                throw new Error("Ödeme yöntemi seçilemedi");
            }
            setPayment(await response.json());
        } catch (error) {
            console.error("Ödeme yöntemi seçilirken hata:", error);
            setPaymentError("Ödeme yöntemi seçilemedi.");
        } finally {
            setPaymentBusy(false);
        }
    };

    const handleAddParticipant = async (event) => {
        event.preventDefault();
        if (!newParticipantName.trim() || isAddingParticipant) {
            return;
        }
        setIsAddingParticipant(true);
        setPaymentError(null);
        try {
            const response = await fetch(`http://localhost:8080/orders/${orderId}/payment/participants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify({ name: newParticipantName.trim() })
            });
            if (!response.ok) {
                throw new Error("Kişi eklenemedi");
            }
            setPayment(await response.json());
            setNewParticipantName("");
            setIsAddParticipantOpen(false);
        } catch (error) {
            console.error("Kişi eklenirken hata:", error);
            setPaymentError("Kişi eklenemedi.");
        } finally {
            setIsAddingParticipant(false);
        }
    };

    const handleRemoveParticipant = async (participantId) => {
        if (paymentBusy || payment?.status === "PAID") {
            return;
        }
        setPaymentBusy(true);
        setPaymentError(null);
        try {
            const response = await fetch(
                `http://localhost:8080/orders/${orderId}/payment/participants/${participantId}`,
                {
                    method: "DELETE",
                    headers: authHeaders()
                }
            );
            if (!response.ok) {
                throw new Error("Kişi silinemedi");
            }
            setPayment(await response.json());
        } catch (error) {
            console.error("Kişi silinirken hata:", error);
            setPaymentError("Kişi silinemedi.");
        } finally {
            setPaymentBusy(false);
        }
    };

    const handleParticipantMethodSelect = async (participantId, method) => {
        if (paymentBusy || payment?.status === "PAID") {
            return;
        }
        setPaymentBusy(true);
        setPaymentError(null);
        try {
            const response = await fetch(
                `http://localhost:8080/orders/${orderId}/payment/participants/${participantId}/method`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...authHeaders()
                    },
                    body: JSON.stringify({ method })
                }
            );
            if (!response.ok) {
                throw new Error("Ödeme yöntemi seçilemedi");
            }
            setPayment(await response.json());
        } catch (error) {
            console.error("Kişi ödeme yöntemi seçilirken hata:", error);
            setPaymentError("Ödeme yöntemi seçilemedi.");
        } finally {
            setPaymentBusy(false);
        }
    };

    // Bölüştür modalındaki "Kaydet" burayı çağırır; hata olursa modal
    // kendi içinde yakalayıp göstersin diye throw ediyoruz.
    const handleSaveAllocations = async (orderItemId, splitType, entries) => {
        const response = await fetch(
            `http://localhost:8080/orders/${orderId}/payment/items/${orderItemId}/allocations`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify({ splitType, entries })
            }
        );
        if (!response.ok) {
            throw new Error("Bölüştürme kaydedilemedi. Dağıtılan tutar ürün fiyatını aşıyor olabilir.");
        }
        const updated = await response.json();
        setPayment(updated);
        return updated;
    };

    const handleCompletePayment = async () => {
        if (!payment || !payment.readyToComplete || isCompletingPayment || payment.status === "PAID") {
            return;
        }
        setIsCompletingPayment(true);
        setPaymentError(null);
        try {
            const response = await fetch(`http://localhost:8080/orders/${orderId}/payment/complete`, {
                method: "POST",
                headers: authHeaders()
            });
            if (!response.ok) {
                throw new Error("Ödeme tamamlanamadı");
            }
            setPayment(await response.json());
        } catch (error) {
            console.error("Ödeme tamamlanırken hata:", error);
            setPaymentError("Ödeme tamamlanamadı.");
        } finally {
            setIsCompletingPayment(false);
        }
    };

    // Yazdırma
    const handlePrint = () => {
        window.print();
    };
    // Yükleniyor durumu
    if (loading) {
        return (
            <Layout navbarType="dashboard" title="Sipariş Detayı">

                <div className="order-detail-page">

                    <p className="order-detail-status-text">
                        Yükleniyor...
                    </p>

                </div>

            </Layout>
        );
    }
    if (loadError || !order) {
        return (
            <Layout navbarType="dashboard" title="Sipariş Detayı">
                <div className="order-detail-page">
                    <Link to="/orders" className="back-link">
                        <span className="material-symbols-outlined">
                            arrow_back
                        </span>
                        Siparişlere Dön
                    </Link>
                    <p className="order-detail-status-text">
                        {loadError ?? "Sipariş bulunamadı."}
                    </p>
                </div>
            </Layout>
        );
    }
    const statusClass = order.status.toLowerCase();
    const isCancelled = order.status === "CANCELLED";
    const isTerminal =
        order.status === "DELIVERED" ||
        order.status === "CANCELLED";
    const currentStepIndex =
        FLOW_STATUSES.indexOf(order.status);

    return (

        <Layout navbarType="dashboard" title="Sipariş Detayı">

            <div className="order-detail-page">


                {/* =================================================
                    ÜST BÖLÜM
                ================================================= */}

                <div className="order-detail-header">

                    <div>

                        <Link to="/orders" className="back-link">

                            <span className="material-symbols-outlined">
                                arrow_back
                            </span>

                            Siparişlere Dön

                        </Link>


                        <div className="order-detail-title-row">

                            <h1>
                                Sipariş #{order.id}
                            </h1>


                            <span
                                className={`status status-${statusClass}`}
                            >

                                <span className="status-dot"></span>

                                {
                                    STATUS_LABELS[order.status]
                                    ?? order.status
                                }

                            </span>

                        </div>


                        <p className="order-detail-subtitle">

                            {formatOrderDateTime(order.orderDate)}

                            {order.table &&
                                ` • Masa ${order.table.tableNumber}`
                            }

                        </p>

                    </div>


                    <div className="order-detail-header-actions">

                        <button
                            className="secondary-button"
                            onClick={handlePrint}
                        >
                            Fiş Yazdır
                        </button>


                        <button
                            className="secondary-button"
                            onClick={() =>
                                setIsDeleteModalOpen(true)
                            }
                        >
                            Siparişi Sil
                        </button>

                    </div>

                </div>


                {/* =================================================
                    ANA GRID
                ================================================= */}

                <div className="order-detail-grid">

                    <div className="order-detail-main">


                        {/* =========================================
                            SİPARİŞ İLERLEMESİ
                        ========================================= */}

                        <section className="order-detail-card">

                            <h2 className="order-detail-card-title">
                                Sipariş İlerlemesi
                            </h2>


                            {isCancelled ? (

                                <div className="order-cancelled-banner">

                                    <span className="material-symbols-outlined">
                                        cancel
                                    </span>

                                    <span>
                                        İptal Edildi
                                    </span>

                                </div>

                            ) : (

                                <div className="order-stepper">

                                    <div className="order-stepper-track"></div>


                                    <div
                                        className="order-stepper-track-active"
                                        style={{
                                            width:
                                                currentStepIndex <= 0
                                                    ? "0%"
                                                    : `${
                                                        (
                                                            currentStepIndex /
                                                            (FLOW_STATUSES.length - 1)
                                                        ) * 100
                                                    }%`
                                        }}
                                    ></div>


                                    {FLOW_STATUSES.map((step, index) => {

                                        const isCompleted =
                                            index < currentStepIndex;

                                        const isActive =
                                            index === currentStepIndex;

                                        const isClickable =
                                            !isSavingStatus &&
                                            step !== order.status;


                                        return (

                                            <button
                                                type="button"
                                                key={step}
                                                className={`order-step ${
                                                    isCompleted
                                                        ? "completed"
                                                        : ""
                                                } ${
                                                    isActive
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    isClickable &&
                                                    handleStatusChange(step)
                                                }
                                                disabled={!isClickable}
                                            >

                                                <span className="order-step-dot">

                                                    {isCompleted && (

                                                        <span className="material-symbols-outlined">
                                                            check
                                                        </span>

                                                    )}

                                                </span>


                                                <span className="order-step-label">
                                                    {STATUS_LABELS[step]}
                                                </span>

                                            </button>

                                        );

                                    })}

                                </div>

                            )}


                            {!isTerminal && (

                                <div className="order-cancel-row">

                                    <button
                                        type="button"
                                        className="order-cancel-link"
                                        onClick={() =>
                                            handleStatusChange("CANCELLED")
                                        }
                                        disabled={isSavingStatus}
                                    >
                                        Siparişi İptal Et
                                    </button>

                                </div>

                            )}

                        </section>


                        {/* =========================================
                            SİPARİŞ ÜRÜNLERİ
                        ========================================= */}

                        <section className="order-detail-card">

                            <div className="order-detail-card-header">

                                <h2 className="order-detail-card-title">
                                    Sipariş Ürünleri
                                </h2>


                                <button
                                    type="button"
                                    className="add-item-toggle"
                                    onClick={() =>
                                        setIsAddItemOpen(
                                            (open) => !open
                                        )
                                    }
                                >
                                    + Ürün Ekle
                                </button>

                            </div>


                            {isAddItemOpen && (

                                <form
                                    className="add-item-form"
                                    onSubmit={handleAddItem}
                                >

                                    <select
                                        value={newItemProductId}
                                        onChange={(event) =>
                                            setNewItemProductId(
                                                event.target.value
                                            )
                                        }
                                        required
                                    >

                                        <option
                                            value=""
                                            disabled
                                        >
                                            Ürün seçin
                                        </option>


                                        {products.map((product) => (

                                            <option
                                                value={product.id}
                                                key={product.id}
                                            >
                                                {product.name} —{" "}
                                                {formatCurrency(
                                                    product.price
                                                )}
                                            </option>

                                        ))}

                                    </select>


                                    <input
                                        type="number"
                                        min="1"
                                        value={newItemQuantity}
                                        onChange={(event) =>
                                            setNewItemQuantity(
                                                event.target.value
                                            )
                                        }
                                    />


                                    <input
                                        type="text"
                                        placeholder="Not (opsiyonel)"
                                        value={newItemNote}
                                        onChange={(event) =>
                                            setNewItemNote(
                                                event.target.value
                                            )
                                        }
                                    />


                                    <button
                                        type="submit"
                                        disabled={isAddingItem}
                                    >
                                        {isAddingItem
                                            ? "Ekleniyor..."
                                            : "Ekle"}
                                    </button>

                                </form>

                            )}


                            <div className="order-items-table-wrap">

                                <table className="order-items-table">

                                    <thead>

                                    <tr>

                                        <th>
                                            Ürün
                                        </th>

                                        <th className="text-center">
                                            Adet
                                        </th>

                                        <th className="text-right">
                                            Birim Fiyat
                                        </th>

                                        <th>
                                            Not
                                        </th>

                                        <th className="text-right">
                                            Ara Toplam
                                        </th>

                                        {payment?.mode === "GERMAN" && (
                                            <th className="text-center">
                                                Bölüştür
                                            </th>
                                        )}

                                    </tr>

                                    </thead>


                                    <tbody>

                                    {itemsForThisOrder.map((item) => (

                                        <tr key={item.id}>

                                            <td>

                                                <div className="order-item-product">

                                                    <div className="order-item-image">

                                                        {item.productImageUrl ? (

                                                            <img
                                                                src={item.productImageUrl}
                                                                alt={item.productName}
                                                                className="order-item-image-img"
                                                            />

                                                        ) : (

                                                            <div className="order-item-image-placeholder"></div>

                                                        )}

                                                    </div>


                                                    <span className="order-item-name">
                                                            {item.productName}
                                                        </span>

                                                </div>

                                            </td>


                                            <td className="text-center">

                                                    <span className="order-item-qty">
                                                        {item.quantity}
                                                    </span>

                                            </td>


                                            <td className="text-right">

                                                {formatCurrency(
                                                    item.unitPrice
                                                )}

                                            </td>


                                            <td className="order-item-note">

                                                {item.note || "—"}

                                            </td>


                                            <td className="text-right order-item-subtotal">

                                                {formatCurrency(
                                                    item.subtotal
                                                )}

                                            </td>

                                            {payment?.mode === "GERMAN" && (

                                                <td className="order-item-split">

                                                    <div className="order-item-split-badges">
                                                        {allocationsForItem(item.id).map((allocation) => (
                                                            <span
                                                                className="split-badge"
                                                                key={allocation.participantId}
                                                            >
                                                                {allocation.participantName}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="split-button"
                                                        onClick={() => setSplitModalItem(item)}
                                                        disabled={
                                                            payment.status === "PAID" ||
                                                            payment.participants.length === 0
                                                        }
                                                    >
                                                        Bölüştür
                                                    </button>

                                                </td>

                                            )}

                                        </tr>

                                    ))}


                                    {itemsForThisOrder.length === 0 && (

                                        <tr>

                                            <td
                                                className="order-items-empty"
                                                colSpan={payment?.mode === "GERMAN" ? 6 : 5}
                                            >
                                                Bu siparişte henüz ürün yok.
                                            </td>

                                        </tr>

                                    )}

                                    </tbody>

                                </table>

                            </div>

                        </section>

                    </div>


                    {/* =================================================
                        ÖDEME YÖNTEMİ
                    ================================================= */}

                    <aside className="order-detail-side">

                        <section className="order-detail-card payment-panel">

                            <div className="payment-panel-header">
                                <h2 className="payment-panel-title">
                                    Ödeme Yöntemi
                                </h2>

                                {payment?.status === "PAID" && (
                                    <span className="payment-paid-badge">
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Ödendi
                                    </span>
                                )}
                            </div>

                            {payment && (

                                <>

                                    <div className="payment-mode-toggle">

                                        <button
                                            type="button"
                                            className={payment.mode === "SINGLE" ? "active" : ""}
                                            onClick={() => handleModeChange("SINGLE")}
                                            disabled={paymentBusy || payment.status === "PAID"}
                                        >
                                            Tek Kişi
                                        </button>

                                        <button
                                            type="button"
                                            className={payment.mode === "GERMAN" ? "active" : ""}
                                            onClick={() => handleModeChange("GERMAN")}
                                            disabled={paymentBusy || payment.status === "PAID"}
                                        >
                                            Alman Usulü
                                        </button>

                                    </div>


                                    {payment.mode === "SINGLE" && (

                                        <div className="single-payment-block">

                                            <div className="single-payment-total">
                                                <span>Toplam Tutar</span>
                                                <strong>{formatCurrency(payment.orderTotal)}</strong>
                                            </div>

                                            <span className="payment-method-label">
                                                Ödeme Yöntemi
                                            </span>

                                            <div className="payment-method-grid">
                                                {["CARD", "CASH", "OTHER"].map((method) => (
                                                    <button
                                                        key={method}
                                                        type="button"
                                                        className={payment.singlePaymentMethod === method ? "active" : ""}
                                                        onClick={() => handleSingleMethodSelect(method)}
                                                        disabled={paymentBusy || payment.status === "PAID"}
                                                    >
                                                        {PAYMENT_METHOD_LABELS[method]}
                                                    </button>
                                                ))}
                                            </div>

                                        </div>

                                    )}


                                    {payment.mode === "GERMAN" && (

                                        <div className="german-payment-block">

                                            <div className="participants-header">

                                                <span className="participants-label">
                                                    Kişiler
                                                </span>

                                                <button
                                                    type="button"
                                                    className="add-participant-toggle"
                                                    onClick={() => setIsAddParticipantOpen((open) => !open)}
                                                    disabled={payment.status === "PAID"}
                                                >
                                                    <span className="material-symbols-outlined">add</span>
                                                    Kişi Ekle
                                                </button>

                                            </div>


                                            {isAddParticipantOpen && (

                                                <form
                                                    className="add-participant-form"
                                                    onSubmit={handleAddParticipant}
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="Kişi adı"
                                                        value={newParticipantName}
                                                        onChange={(event) => setNewParticipantName(event.target.value)}
                                                        autoFocus
                                                    />
                                                    <button type="submit" disabled={isAddingParticipant}>
                                                        {isAddingParticipant ? "Ekleniyor..." : "Ekle"}
                                                    </button>
                                                </form>

                                            )}


                                            <div className="participants-list">

                                                {payment.participants.length === 0 && (
                                                    <p className="participants-empty">
                                                        Henüz kişi eklenmedi.
                                                    </p>
                                                )}

                                                {payment.participants.map((participant) => {

                                                    const isExpanded = expandedParticipants[participant.id] !== false;

                                                    return (

                                                        <div
                                                            className="participant-card"
                                                            key={participant.id}
                                                        >

                                                            <button
                                                                type="button"
                                                                className="participant-card-header"
                                                                onClick={() => toggleParticipantExpanded(participant.id)}
                                                            >
                                                                <span className="participant-name">
                                                                    {participant.name}
                                                                </span>
                                                                <span className="participant-total">
                                                                    Kişi Toplamı: {formatCurrency(participant.personTotal)}
                                                                </span>
                                                                <span className="material-symbols-outlined participant-chevron">
                                                                    {isExpanded ? "expand_less" : "expand_more"}
                                                                </span>
                                                            </button>

                                                            {isExpanded && (

                                                                <div className="participant-card-body">

                                                                    {participant.allocations.length === 0 ? (

                                                                        <p className="participant-no-items">
                                                                            Henüz ürün atanmadı
                                                                        </p>

                                                                    ) : (

                                                                        <div className="participant-item-list">
                                                                            {participant.allocations.map((allocation) => {
                                                                                const relatedItem = itemsForThisOrder.find(
                                                                                    (candidate) => candidate.id === allocation.orderItemId
                                                                                );
                                                                                return (
                                                                                    <div
                                                                                        className="participant-item-row"
                                                                                        key={allocation.orderItemId}
                                                                                    >
                                                                                        <span>
                                                                                            {relatedItem?.productName ?? `Ürün #${allocation.orderItemId}`}
                                                                                            {allocation.quantity ? ` ×${allocation.quantity}` : ""}
                                                                                        </span>
                                                                                        <span>
                                                                                            {formatCurrency(allocation.amount)}
                                                                                        </span>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>

                                                                    )}

                                                                    <div className="participant-method-block">

                                                                        <span className="payment-method-label">
                                                                            Ödeme Yöntemi
                                                                        </span>

                                                                        <div className="payment-method-grid three-col">
                                                                            {["CARD", "CASH", "OTHER"].map((method) => (
                                                                                <button
                                                                                    key={method}
                                                                                    type="button"
                                                                                    className={participant.paymentMethod === method ? "active" : ""}
                                                                                    onClick={() => handleParticipantMethodSelect(participant.id, method)}
                                                                                    disabled={paymentBusy || payment.status === "PAID"}
                                                                                >
                                                                                    {PAYMENT_METHOD_LABELS[method]}
                                                                                </button>
                                                                            ))}
                                                                        </div>

                                                                    </div>

                                                                    {payment.status !== "PAID" && (
                                                                        <button
                                                                            type="button"
                                                                            className="participant-remove"
                                                                            onClick={() => handleRemoveParticipant(participant.id)}
                                                                        >
                                                                            Kişiyi Kaldır
                                                                        </button>
                                                                    )}

                                                                </div>

                                                            )}

                                                        </div>

                                                    );

                                                })}

                                            </div>

                                        </div>

                                    )}


                                    {paymentError && (
                                        <p className="payment-error-text">
                                            {paymentError}
                                        </p>
                                    )}


                                    <div className="payment-summary-block">

                                        <div className="payment-summary-row">
                                            <span>Sipariş Toplamı</span>
                                            <span>{formatCurrency(payment.orderTotal)}</span>
                                        </div>

                                        {payment.mode === "GERMAN" && (

                                            <>

                                                <div className="payment-summary-row">
                                                    <span>Dağıtılan Tutar</span>
                                                    <span className="accent">{formatCurrency(payment.distributedAmount)}</span>
                                                </div>

                                                <div className="payment-summary-row total">
                                                    <span>Kalan Tutar</span>
                                                    <span>{formatCurrency(payment.remainingAmount)}</span>
                                                </div>

                                            </>

                                        )}

                                    </div>


                                    <button
                                        type="button"
                                        className="complete-payment-button"
                                        onClick={handleCompletePayment}
                                        disabled={
                                            !payment.readyToComplete ||
                                            isCompletingPayment ||
                                            payment.status === "PAID"
                                        }
                                    >
                                        {payment.status === "PAID"
                                            ? "Ödeme Tamamlandı"
                                            : isCompletingPayment
                                                ? "Tamamlanıyor..."
                                                : "ÖDEMEYİ TAMAMLA"}
                                    </button>

                                    <p className="complete-payment-hint">
                                        Tüm tutar dağıtılmalı ve ödeme yöntemleri seçilmelidir.
                                    </p>

                                </>

                            )}

                        </section>

                    </aside>

                </div>

            </div>


            {splitModalItem && (

                <SplitItemModal
                    item={splitModalItem}
                    participants={payment.participants.map((p) => ({ id: p.id, name: p.name }))}
                    existingAllocations={allocationsForItem(splitModalItem.id)}
                    onCancel={() => setSplitModalItem(null)}
                    onSave={async (splitType, entries) => {
                        await handleSaveAllocations(splitModalItem.id, splitType, entries);
                        setSplitModalItem(null);
                    }}
                />

            )}


            <DeleteConfirmModal
                open={isDeleteModalOpen}
                title="Siparişi Sil?"
                message={`Sipariş #${order.id} silinsin mi? Bu işlem geri alınamaz.`}
                confirmLabel="Siparişi Sil"
                isConfirming={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() =>
                    setIsDeleteModalOpen(false)
                }
            />

        </Layout>

    );

}
export default OrderDetail;