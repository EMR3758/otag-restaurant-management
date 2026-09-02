import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SiteSearch from "./SiteSearch";
import "./SiteNavbar.css";

const NAV_LINKS = [
    { to: "/", label: "Ana Sayfa", end: true },
    { to: "/full-menu", label: "Menü" },
    { to: "/reservation", label: "Rezervasyon" },
    { to: "/about", label: "Hakkımızda" },
    { to: "/contact", label: "İletişim" }
];

function SiteNavbar() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [searchOpen, setSearchOpen] = useState(false);
    const isHome = pathname === "/";
    return (
        <header className={`site-navbar${isHome ? " site-navbar-overlay" : ""}`}>
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
                        aria-label="Ürün ara"
                        onClick={() => setSearchOpen(true)}
                    >
                        <span className="material-symbols-outlined">search</span>
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

            {searchOpen && <SiteSearch onClose={() => setSearchOpen(false)} />}
        </header>
    );
}

export default SiteNavbar;
