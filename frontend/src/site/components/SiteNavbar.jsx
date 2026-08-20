import { NavLink, useNavigate } from "react-router-dom";
import "./SiteNavbar.css";

const NAV_LINKS = [
    { to: "/", label: "Home", end: true },
    { to: "/full-menu", label: "Menu" },
    { to: "/reservation", label: "Reservation" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" }
];

function SiteNavbar() {
    const navigate = useNavigate();

    return (
        <header className="site-navbar">
            <div className="site-navbar-inner site-container">
                <NavLink to="/" className="site-logo">
                    Otağ Cafe
                </NavLink>

                <nav className="site-nav-links">
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) =>
                                `site-nav-link${isActive ? " active" : ""}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="site-nav-actions">
                    <button
                        type="button"
                        className="site-icon-button"
                        aria-label="Ara"
                        onClick={() => navigate("/full-menu")}
                    >
                        <span className="material-symbols-outlined">search</span>
                    </button>

                    <button
                        type="button"
                        className="site-icon-button"
                        aria-label="Sepet"
                        onClick={() => navigate("/cart")}
                    >
                        <span className="material-symbols-outlined">shopping_cart</span>
                    </button>

                    <button
                        type="button"
                        className="site-icon-button"
                        aria-label="Profil"
                        onClick={() => navigate("/account")}
                    >
                        <span className="material-symbols-outlined">person</span>
                    </button>

                    <button
                        type="button"
                        className="site-cta-button"
                        onClick={() => navigate("/reservation")}
                    >
                        Rezervasyon Yap
                    </button>
                </div>
            </div>
        </header>
    );
}

export default SiteNavbar;
