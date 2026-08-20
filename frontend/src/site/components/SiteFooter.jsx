import { NavLink } from "react-router-dom";
import "./SiteFooter.css";

function SiteFooter() {
    return (
        <footer className="site-footer">
            <div className="site-footer-grid site-container">
                <div className="site-footer-brand">
                    <div className="site-logo">Otağ Cafe</div>
                    <p>
                        Crafted for Hospitality. Geleneği modern bir konukseverlik
                        anlayışıyla harmanlayan özenle kürate edilmiş bir deneyim.
                    </p>
                </div>

                <div className="site-footer-col">
                    <h4>Keşfet</h4>
                    <NavLink to="/full-menu">Menu</NavLink>
                    <NavLink to="/reservation">Reservations</NavLink>
                    <NavLink to="/account">Account</NavLink>
                </div>

                <div className="site-footer-col">
                    <h4>İletişim</h4>
                    <a href="#">Address</a>
                    <a href="#">Phone</a>
                    <a href="#">Email</a>
                </div>

                <div className="site-footer-col">
                    <h4>Sosyal</h4>
                    <a href="#">Instagram</a>
                    <a href="#">WhatsApp</a>
                </div>
            </div>

            <div className="site-footer-bottom site-container">
                <p>© 2026 Otağ Cafe. Crafted for Hospitality.</p>
            </div>
        </footer>
    );
}

export default SiteFooter;
