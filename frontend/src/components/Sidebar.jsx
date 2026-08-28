import { NavLink,useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ open = false, onClose = () => {} }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");

        navigate("/login");
    };
    return (
        <aside className={`sidebar ${open ? "open" : ""}`}>

            <div className="logo-area">

                <div className="logo-circle">
                    O
                </div>

                <div className="logo-text">
                    <h1>OTAĞ</h1>
                    <p>Restaurant Yönetimi</p>
                </div>

            </div>


            <nav className="sidebar-menu" onClick={onClose}>

                <p className="menu-section-label menu-section-label-first">
                    Genel
                </p>


                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                dashboard
                            </span>

                            <span>
                                Kontrol Paneli
                            </span>
                        </>
                    )}
                </NavLink>


                <NavLink
                    to="/orders"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                receipt_long
                            </span>

                            <span>
                                Siparişler
                            </span>
                        </>
                    )}
                </NavLink>


                <NavLink
                    to="/menu"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                restaurant_menu
                            </span>

                            <span>
                                Menü
                            </span>
                        </>
                    )}
                </NavLink>


                <NavLink
                    to="/categories"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                category
                            </span>

                            <span>
                                Kategoriler
                            </span>
                        </>
                    )}
                </NavLink>


                <NavLink
                    to="/tables"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                table_restaurant
                            </span>

                            <span>
                                Masalar
                            </span>
                        </>
                    )}
                </NavLink>


                <NavLink
                    to="/stock"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                inventory_2
                            </span>

                            <span>
                                Stok
                            </span>
                        </>
                    )}
                </NavLink>


                <p className="menu-section-label">
                    Operasyon
                </p>


                <NavLink
                    to="/mutfak"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                soup_kitchen
                            </span>

                            <span>
                                Mutfak
                            </span>
                        </>
                    )}
                </NavLink>


                <NavLink
                    to="/bar"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                local_bar
                            </span>

                            <span>
                                Bar
                            </span>
                        </>
                    )}
                </NavLink>


                <NavLink
                    to="/nargile"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                smoking_rooms
                            </span>

                            <span>
                                Nargile
                            </span>
                        </>
                    )}
                </NavLink>


                <p className="menu-section-label">
                    Yönetim
                </p>


                <NavLink
                    to="/reservations"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                event
                            </span>

                            <span>
                                Rezervasyonlar
                            </span>
                        </>
                    )}
                </NavLink>


                <NavLink
                    to="/users"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                group
                            </span>

                            <span>
                                Personeller
                            </span>
                        </>
                    )}
                </NavLink>


                <NavLink
                    to="/finance"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                account_balance
                            </span>

                            <span>
                                Finans
                            </span>
                        </>
                    )}
                </NavLink>


                <NavLink
                    to="/settings"
                    className={({ isActive }) => `menu-item${isActive ? " active" : ""}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined${isActive ? " icon-fill" : ""}`}>
                                settings
                            </span>

                            <span>
                                Ayarlar
                            </span>
                        </>
                    )}
                </NavLink>

            </nav>


            <button className="logout-button" onClick={handleLogout}>

                <span className="material-symbols-outlined">
                    logout
                </span>

                <span>
                    ÇIKIŞ YAP
                </span>

            </button>

        </aside>
    );
}

export default Sidebar;