import { createContext, useContext, useMemo, useState } from "react";

const NotificationsContext = createContext(null);

// Backend bağlantısı henüz yok; şimdilik mock bildirim verisi kullanılıyor.
// orderId alanı, "Siparişi Görüntüle" aksiyonunun gideceği /orders/:id rotasına
// karşılık gelen demo bir değerdir.
const INITIAL_NOTIFICATIONS = [
    {
        id: 1,
        type: "order",
        icon: "receipt_long",
        variant: "primary",
        title: "Yeni Sipariş Alındı",
        message: "B-05 masası için #1024 numaralı yeni sipariş alındı.",
        time: "ŞİMDİ",
        read: false,
        orderId: 1
    },
    {
        id: 2,
        type: "stock",
        icon: "warning",
        variant: "error",
        title: "Stok Uyarısı",
        message: "Düşük stok uyarısı: Antrikot (5 adet kaldı). Tükenmeden yeniden sipariş verin.",
        time: "10 DK ÖNCE",
        read: false
    },
    {
        id: 3,
        type: "table",
        icon: "table_restaurant",
        variant: "muted",
        title: "Masa Durumu Değişti",
        message: "B-12 masasının durumu Dolu olarak değiştirildi.",
        time: "1 SA ÖNCE",
        read: true
    },
    {
        id: 4,
        type: "system",
        icon: "person_add",
        variant: "muted",
        title: "Sistem Bildirimi",
        message: "Elif Demir için 'Garson' yetkisiyle personel hesabı oluşturuldu.",
        time: "DÜN",
        read: true
    },
    {
        id: 5,
        type: "payment",
        icon: "payments",
        variant: "muted",
        title: "Ödeme Sorunu",
        message: "#1019 numaralı siparişte ödeme reddedildi. Terminal çözümü bekleniyor.",
        time: "DÜN",
        read: true
    }
];

export function NotificationsProvider({ children }) {

    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((item) => (item.id === id ? { ...item, read: true } : item))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    };

    const unreadCount = useMemo(
        () => notifications.filter((item) => !item.read).length,
        [notifications]
    );

    const value = {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead
    };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );

}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error("useNotifications, NotificationsProvider içinde kullanılmalıdır.");
    }
    return context;
}
