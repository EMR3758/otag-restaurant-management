import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useNotifications } from "../context/NotificationsContext";

function Navbar({ type = "default", title, searchPlaceholder = "Ara...", onMenuClick = () => {} }) {

    const navigate = useNavigate();
    const { unreadCount } = useNotifications();

    const handleNotificationsClick = () => {
        navigate("/notifications");
    };

    const handleProfileClick = () => {
        navigate("/settings");
    };

    if (type === "dashboard") {

        return (
            <header className={`topbar ${type}`}>

                <div className="topbar-left">

                    <button className="menu-button" onClick={onMenuClick}>
                        <span className="material-symbols-outlined">
                            menu
                        </span>
                    </button>

                    <h2 className="topbar-title">
                        {title}
                    </h2>

                </div>

                <div className="topbar-right">

                    <button
                        className="notification-button"
                        onClick={handleNotificationsClick}
                        aria-label="Bildirimler"
                    >
                        <span className="material-symbols-outlined">
                            notifications
                        </span>

                        {unreadCount > 0 && (
                            <span className="notification-dot">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    <button
                        className="user-info"
                        onClick={handleProfileClick}
                        aria-label="Ayarlar"
                    >

                        <div className="user-text">
                            <p className="user-name">Emirhan</p>
                            <p className="user-role">Yönetici</p>
                        </div>

                        <div className="user-avatar">
                            <span className="material-symbols-outlined">
                                person
                            </span>
                        </div>

                    </button>

                </div>

            </header>
        );

    }

    return (
        <header className={`topbar ${type}`}>

            <div className="topbar-left">

                <button className="menu-button" onClick={onMenuClick}>
                    <span className="material-symbols-outlined">
                        menu
                    </span>
                </button>

                <div className="search-box">
                    <span className="material-symbols-outlined">
                        search
                    </span>

                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                    />
                </div>

            </div>

            <div className="topbar-right">

                <button
                    className="icon-button notification-button"
                    onClick={handleNotificationsClick}
                    aria-label="Bildirimler"
                >
                    <span className="material-symbols-outlined">
                        notifications
                    </span>

                    {unreadCount > 0 && (
                        <span className="notification-dot">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>

                {type === "tables" && (
                    <button className="icon-button">
                        <span className="material-symbols-outlined">
                            help
                        </span>
                    </button>
                )}

                <button
                    className="user-info"
                    onClick={handleProfileClick}
                    aria-label="Ayarlar"
                >

                    <div className="user-avatar">
                        <span className="material-symbols-outlined">
                            person
                        </span>
                    </div>

                    <div>
                        <strong>Profile Settings</strong>
                    </div>

                </button>

            </div>

        </header>
    );
}

export default Navbar;