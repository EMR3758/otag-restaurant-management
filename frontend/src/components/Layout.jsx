import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

function Layout({ children, navbarType = "default", searchPlaceholder = "Ara...", title }) {

    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="app-layout">

            <Sidebar
                open={mobileNavOpen}
                onClose={() => setMobileNavOpen(false)}
            />

            <div
                className={`nav-backdrop ${mobileNavOpen ? "open" : ""}`}
                onClick={() => setMobileNavOpen(false)}
            />

            <div className="main-area">

                <Navbar
                    type={navbarType}
                    title={title}
                    searchPlaceholder={searchPlaceholder}
                    onMenuClick={() => setMobileNavOpen(true)}
                />

                <main className="page-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default Layout;