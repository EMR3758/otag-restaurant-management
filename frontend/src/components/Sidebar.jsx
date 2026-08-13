import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ open = false, onClose = () => {} }) {

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


                <a href="#" className="menu-item">
                    <span className="material-symbols-outlined">
                        restaurant_menu
                    </span>

                    <span>
                        Menü
                    </span>
                </a>


                <a href="#" className="menu-item">
                    <span className="material-symbols-outlined">
                        category
                    </span>

                    <span>
                        Kategoriler
                    </span>
                </a>


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


                <a href="#" className="menu-item">
                    <span className="material-symbols-outlined">
                        group
                    </span>

                    <span>
                        Kullanıcılar
                    </span>
                </a>


                <a href="#" className="menu-item">
                    <span className="material-symbols-outlined">
                        settings
                    </span>

                    <span>
                        Ayarlar
                    </span>
                </a>

            </nav>


            <button className="logout-button">

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