import { NavLink } from "react-router-dom";
import "./BottomNav.css";

const BOTTOM_LINKS = [
    { to: "/", label: "Ana Sayfa", icon: "home", end: true },
    { to: "/full-menu", label: "Menü", icon: "restaurant_menu" },
    { to: "/reservation", label: "Rezervasyon", icon: "calendar_month" },
    { to: "/contact", label: "İletişim", icon: "call" }
];

function BottomNav() {
    return (
        <nav className="site-bottom-nav">
            {BOTTOM_LINKS.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                        `site-bottom-nav-item${isActive ? " active" : ""}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <span
                                className="material-symbols-outlined"
                                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                                {link.icon}
                            </span>
                            <span>{link.label}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}

export default BottomNav;
