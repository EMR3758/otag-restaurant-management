import "./Navbar.css";

function Navbar({ type = "default", title, searchPlaceholder = "Ara...", onMenuClick = () => {} }) {

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

                    <button className="notification-button">
                        <span className="material-symbols-outlined">
                            notifications
                        </span>

                        <span className="notification-dot" />
                    </button>

                    <div className="user-info">

                        <div className="user-text">
                            <p className="user-name">Emirhan</p>
                            <p className="user-role">Yönetici</p>
                        </div>

                        <div className="user-avatar">
                            <span className="material-symbols-outlined">
                                person
                            </span>
                        </div>

                    </div>

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

                <button className="icon-button">
                    <span className="material-symbols-outlined">
                        notifications
                    </span>
                </button>

                {type === "tables" && (
                    <button className="icon-button">
                        <span className="material-symbols-outlined">
                            help
                        </span>
                    </button>
                )}

                <div className="user-info">

                    <div className="user-avatar">
                        <span className="material-symbols-outlined">
                            person
                        </span>
                    </div>

                    <div>
                        <strong>Profile Settings</strong>
                    </div>

                </div>

            </div>

        </header>
    );
}

export default Navbar;