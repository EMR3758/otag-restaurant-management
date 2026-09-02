import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

const NotificationsContext = createContext(null);

const API_URL = "http://localhost:8080/notifications";

export function NotificationsProvider({ children }) {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = 1;

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}?userId=${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Bildirimler alınamadı.");
            }

            const data = await response.json();

            console.log("Notifications:", data);

            const mappedNotifications = data.map((notification) => ({
                id: notification.id,
                type: notification.type?.toLowerCase() || "system",
                icon: getNotificationIcon(notification.type),
                variant: getNotificationVariant(notification.type),
                title: notification.title,
                message: notification.message,
                time: formatNotificationTime(notification.createdAt),

                // BACKEND'DE ALANIN ADI "read"
                read: notification.read,

                orderId: notification.orderId
            }));

            setNotifications(mappedNotifications);

        } catch (error) {

            console.error(
                "Notification error:",
                error
            );

            setNotifications([]);

        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {

        setNotifications((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, read: true }
                    : item
            )
        );

    };

    const markAllAsRead = async () => {

        setNotifications((prev) =>
            prev.map((item) => ({
                ...item,
                read: true
            }))
        );

    };

    const unreadCount = useMemo(
        () => notifications.filter((item) => !item.read).length,
        [notifications]
    );

    const value = {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refreshNotifications: fetchNotifications
    };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
}

function getNotificationIcon(type) {

    switch (type?.toUpperCase()) {

        case "ORDER":
            return "receipt_long";

        case "STOCK":
            return "warning";

        case "CONTACT":
            return "mail";

        case "TABLE":
            return "table_restaurant";

        case "SYSTEM":
            return "person_add";

        default:
            return "notifications";
    }
}

function getNotificationVariant(type) {

    switch (type?.toUpperCase()) {

        case "ORDER":
            return "primary";

        case "STOCK":
            return "error";

        case "CONTACT":
            return "primary";

        default:
            return "muted";
    }
}

function formatNotificationTime(createdAt) {

    if (!createdAt) {
        return "";
    }

    const date = new Date(createdAt);
    const now = new Date();

    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
        return "ŞİMDİ";
    }

    if (diffMinutes < 60) {
        return `${diffMinutes} DK ÖNCE`;
    }

    if (diffHours < 24) {
        return `${diffHours} SA ÖNCE`;
    }

    if (diffDays === 1) {
        return "DÜN";
    }

    return `${diffDays} GÜN ÖNCE`;
}

export function useNotifications() {

    const context = useContext(NotificationsContext);

    if (!context) {
        throw new Error(
            "useNotifications, NotificationsProvider içinde kullanılmalıdır."
        );
    }

    return context;
}