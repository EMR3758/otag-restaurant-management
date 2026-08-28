// =============================================================
// KDS (Mutfak / Bar / Nargile) için ortak MOCK sipariş kaynağı.
//
// Backend henüz yok; bu dosya sadece frontend geliştirme ve tasarım
// amaçlıdır. Şekil, ileride gerçek Order / OrderItem API response'una
// birebir taşınabilecek şekilde kuruldu: her sipariş tek bir "order",
// içindeki her ürün ise kendi "station" (KITCHEN/BAR/NARGILE) ve kendi
// "status" değerine sahip bir OrderItem gibi düşünülebilir.
//
// Üç KDS ekranı da bu TEK kaynağı istasyona göre filtreleyerek kullanır;
// ayrı ayrı sipariş modelleri oluşturulmaz.
// =============================================================

export const KDS_STATIONS = {
    KITCHEN: "KITCHEN",
    BAR: "BAR",
    NARGILE: "NARGILE",
};

export const KDS_STATUS = {
    WAITING: "WAITING",
    PREPARING: "PREPARING",
    READY: "READY",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
};

export const KDS_STATUS_LABELS = {
    WAITING: "BEKLEYEN",
    PREPARING: "HAZIRLANIYOR",
    READY: "HAZIR",
    DELIVERED: "TESLİM EDİLDİ",
    CANCELLED: "İPTAL EDİLDİ",
};

// Bir sonraki durum haritası. Nargile ekranı DELIVERED kullanmadığı için
// READY'den sonrasını hiç istemez (KdsStationBoard bunu "finalStatus" ile keser).
export const KDS_NEXT_STATUS = {
    WAITING: KDS_STATUS.PREPARING,
    PREPARING: KDS_STATUS.READY,
    READY: KDS_STATUS.DELIVERED,
};

// Bu süreyi WAITING/PREPARING olarak aşan aktif biletler "GECİKEN" sayılır.
export const KDS_DELAY_THRESHOLD_MINUTES = 15;

const minutesAgoIso = (minutes) =>
    new Date(Date.now() - minutes * 60000).toISOString();

// Ortak mock sipariş listesi. Bazı siparişler tek istasyona,
// bazıları (gerçek hayattaki gibi) birden fazla istasyona ait ürün içerir.
export const initialMockKdsOrders = [
    {
        id: 1048,
        table: "C-02",
        createdAt: minutesAgoIso(22),
        items: [
            { id: "1048-1", productName: "Burger", station: KDS_STATIONS.KITCHEN, quantity: 2, note: "Soğansız", status: KDS_STATUS.PREPARING },
            { id: "1048-2", productName: "Mercimek Çorbası", station: KDS_STATIONS.KITCHEN, quantity: 2, status: KDS_STATUS.PREPARING },
            { id: "1048-3", productName: "Latte", station: KDS_STATIONS.BAR, quantity: 1, note: "Laktozsuz süt", status: KDS_STATUS.WAITING },
        ],
    },
    {
        id: 1051,
        table: "T-02",
        createdAt: minutesAgoIso(3),
        items: [
            { id: "1051-1", productName: "Margarita Pizza", station: KDS_STATIONS.KITCHEN, quantity: 1, status: KDS_STATUS.WAITING },
            { id: "1051-2", productName: "Sezar Salata", station: KDS_STATIONS.KITCHEN, quantity: 1, note: "Tavuksuz", status: KDS_STATUS.WAITING },
        ],
    },
    {
        id: 1042,
        table: "T-12",
        createdAt: minutesAgoIso(18),
        items: [
            { id: "1042-1", productName: "Dana Antrikot", station: KDS_STATIONS.KITCHEN, quantity: 1, note: "Orta-iyi pişmiş, püre yerine patates kızartması", status: KDS_STATUS.PREPARING },
            { id: "1042-2", productName: "Izgara Köfte", station: KDS_STATIONS.KITCHEN, quantity: 1, status: KDS_STATUS.PREPARING },
        ],
    },
    {
        id: 1046,
        table: "C-05",
        createdAt: minutesAgoIso(11),
        items: [
            { id: "1046-1", productName: "Izgara Tavuk", station: KDS_STATIONS.KITCHEN, quantity: 2, note: "Acısız", status: KDS_STATUS.READY },
            { id: "1046-2", productName: "Filtre Kahve", station: KDS_STATIONS.BAR, quantity: 1, status: KDS_STATUS.READY },
        ],
    },
    {
        id: 1052,
        table: "B-04",
        createdAt: minutesAgoIso(6),
        items: [
            { id: "1052-1", productName: "Double Apple", station: KDS_STATIONS.NARGILE, quantity: 1, mix: "Apple + Mint", status: KDS_STATUS.WAITING },
            { id: "1052-2", productName: "Mojito", station: KDS_STATIONS.BAR, quantity: 2, status: KDS_STATUS.WAITING },
        ],
    },
    {
        id: 1054,
        table: "B-08",
        createdAt: minutesAgoIso(2),
        items: [
            { id: "1054-1", productName: "Türk Kahvesi", station: KDS_STATIONS.BAR, quantity: 2, note: "Orta şekerli", status: KDS_STATUS.WAITING },
            { id: "1054-2", productName: "Cola", station: KDS_STATIONS.BAR, quantity: 1, status: KDS_STATUS.WAITING },
        ],
    },
    {
        id: 1055,
        table: "T-12",
        createdAt: minutesAgoIso(9),
        items: [
            { id: "1055-1", productName: "Love 66", station: KDS_STATIONS.NARGILE, quantity: 1, mix: "Standart", status: KDS_STATUS.PREPARING },
        ],
    },
    {
        id: 1039,
        table: "İç-02",
        createdAt: minutesAgoIso(30),
        items: [
            { id: "1039-1", productName: "Grape Mint", station: KDS_STATIONS.NARGILE, quantity: 1, mix: "Grape + Mint", status: KDS_STATUS.CANCELLED },
            { id: "1039-2", productName: "Cola", station: KDS_STATIONS.BAR, quantity: 1, status: KDS_STATUS.CANCELLED },
        ],
    },
    {
        id: 1057,
        table: "T-07",
        createdAt: minutesAgoIso(1),
        items: [
            { id: "1057-1", productName: "Tatlı Tabağı", station: KDS_STATIONS.KITCHEN, quantity: 1, status: KDS_STATUS.CANCELLED },
        ],
    },
];

// Aynı sipariş + istasyon grubundaki item'lar tek biletmiş gibi hazırlanır.
// Bilet durumu, iptal olmayan item'lar arasında en geride olana göre belirlenir
// (elle hazırlanan mock veri içinde her zaman aynıdır, bu sadece güvenlik içindir).
function deriveTicketStatus(items) {
    if (items.every((item) => item.status === KDS_STATUS.CANCELLED)) {
        return KDS_STATUS.CANCELLED;
    }

    const progressOrder = [KDS_STATUS.WAITING, KDS_STATUS.PREPARING, KDS_STATUS.READY, KDS_STATUS.DELIVERED];

    return items
        .filter((item) => item.status !== KDS_STATUS.CANCELLED)
        .reduce(
            (least, item) =>
                progressOrder.indexOf(item.status) < progressOrder.indexOf(least)
                    ? item.status
                    : least,
            items[0].status
        );
}

// Verilen sipariş listesini bir istasyona göre filtreleyip "bilet" haline getirir.
// Her bilet: { orderId, table, createdAt, items, status }
export function getStationTickets(orders, station) {
    return orders
        .map((order) => {
            const items = order.items.filter((item) => item.station === station);

            if (items.length === 0) {
                return null;
            }

            return {
                orderId: order.id,
                table: order.table,
                createdAt: order.createdAt,
                items,
                status: deriveTicketStatus(items),
            };
        })
        .filter(Boolean)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export function isTicketDelayed(ticket) {
    if (ticket.status !== KDS_STATUS.WAITING && ticket.status !== KDS_STATUS.PREPARING) {
        return false;
    }

    const elapsedMinutes = (Date.now() - new Date(ticket.createdAt).getTime()) / 60000;

    return elapsedMinutes >= KDS_DELAY_THRESHOLD_MINUTES;
}

export function getElapsedMinutes(createdAt) {
    return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
}
