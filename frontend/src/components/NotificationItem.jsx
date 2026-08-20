import { useNavigate } from "react-router-dom";
import "./NotificationItem.css";

function NotificationItem({ notification, onMarkRead }) {

    const navigate = useNavigate();

    const handleCardClick = () => {
        if (!notification.read) {
            onMarkRead(notification.id);
        }
    };

    const handleViewOrderClick = (event) => {
        event.stopPropagation();
        onMarkRead(notification.id);
        navigate(`/orders/${notification.orderId}`);
    };

    return (
        <div
            className={`notification-item ${notification.read ? "read" : "unread"} variant-${notification.variant}`}
            onClick={handleCardClick}
            role={notification.read ? undefined : "button"}
            tabIndex={notification.read ? undefined : 0}
        >

            {!notification.read && <span className="notification-accent" />}

            <div className="notification-icon">
                <span className="material-symbols-outlined">{notification.icon}</span>
            </div>

            <div className="notification-body">

                <div className="notification-body-head">
                    <h3>
                        {notification.title}
                        {!notification.read && <span className="notification-unread-dot" />}
                    </h3>
                    <span className="notification-time">{notification.time}</span>
                </div>

                <p>{notification.message}</p>

                {notification.type === "order" && !notification.read && (
                    <div className="notification-actions">
                        <button type="button" onClick={handleViewOrderClick}>
                            Siparişi Görüntüle
                        </button>
                    </div>
                )}

            </div>

        </div>
    );
}

export default NotificationItem;
