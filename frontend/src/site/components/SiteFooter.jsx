import { NavLink } from "react-router-dom";
import { SITE_CONTACT } from "../data/siteContact";
import "./SiteFooter.css";

function SiteFooter() {
    return (
        <footer className="site-footer">
            <div className="site-footer-grid site-container">
                <div className="site-footer-brand">
                    <div className="site-logo">Otağ Cafe</div>
                    <p>
                        Lezzet, keyif ve sıcak bir atmosferi bir araya getiren Otağ
                        Cafe'ye hoş geldiniz.
                    </p>
                </div>

                <div className="site-footer-col">
                    <h4>Keşfet</h4>
                    <NavLink to="/">Ana Sayfa</NavLink>
                    <NavLink to="/full-menu">Menü</NavLink>
                    <NavLink to="/reservation">Rezervasyon</NavLink>
                    <NavLink to="/about">Hakkımızda</NavLink>
                </div>

                <div className="site-footer-col">
                    <h4>İletişim</h4>
                    <span className="site-footer-text">
                        {SITE_CONTACT.addressLines[0]}
                        <br />
                        {SITE_CONTACT.addressLines[1]}
                    </span>
                    <a href={SITE_CONTACT.phoneHref}>{SITE_CONTACT.phoneDisplay}</a>
                    <a href={SITE_CONTACT.emailHref}>{SITE_CONTACT.email}</a>
                </div>

                <div className="site-footer-col">
                    <h4>Sosyal</h4>
                    <a href={SITE_CONTACT.instagramHref} target="_blank" rel="noreferrer">
                        Instagram — {SITE_CONTACT.instagramHandle}
                    </a>
                    <a href={SITE_CONTACT.whatsappHref} target="_blank" rel="noreferrer">
                        WhatsApp — {SITE_CONTACT.whatsappDisplay}
                    </a>
                </div>
            </div>

            <div className="site-footer-bottom site-container">
                <p>© 2026 Otağ Cafe. Tüm hakları saklıdır.</p>
            </div>
        </footer>
    );
}

export default SiteFooter;
