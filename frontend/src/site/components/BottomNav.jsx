import { NavLink } from "react-router-dom";
import "./BottomNav.css";

const BOTTOM_LINKS = [
    { to: "/", label: "Home", icon: "home", end: true },
    { to: "/full-menu", label: "Menu", icon: "restaurant_menu" },
    { to: "/reservation", label: "Reservation", icon: "calendar_month" },
    { to: "/cart", label: "Cart", icon: "shopping_bag" },
    { to: "/account", label: "Profile", icon: "person" }
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
