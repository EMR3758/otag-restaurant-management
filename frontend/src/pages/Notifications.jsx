import "./Notifications.css";
import Layout from "../components/Layout";
import NotificationItem from "../components/NotificationItem";
import { useNotifications } from "../context/NotificationsContext";

function Notifications() {

    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    return (
        <Layout
            navbarType="dashboard"
            title="Bildirimler"
        >

            <div className="notifications-page">

                <div className="notifications-header">
                    <div>
                        <h1>Bildirimler</h1>
                        <p>
                            {unreadCount > 0
                                ? `${unreadCount} okunmamış bildiriminiz var.`
                                : "Tüm bildirimleriniz okundu."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="mark-all-read-button"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        <span className="material-symbols-outlined">done_all</span>
                        Tümünü Okundu Olarak İşaretle
                    </button>
                </div>

                <div className="notifications-list">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkRead={markAsRead}
                        />
                    ))}
                </div>

            </div>

        </Layout>
    );
}

export default Notifications;
