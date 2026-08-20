import { useNavigate } from "react-router-dom";
import SiteLayout from "../components/SiteLayout";
import SitePageHeader from "../components/SitePageHeader";
import "./Account.css";

function Account() {
    const navigate = useNavigate();

    return (
        <SiteLayout>
            <SitePageHeader eyebrow="Profil" title="Hesabım" />

            <section className="account-card site-container">
                <span className="material-symbols-outlined">person</span>
                <h2>Henüz giriş yapmadınız</h2>
                <p>
                    Rezervasyonlarınızı ve siparişlerinizi takip etmek için hesabınıza giriş
                    yapabilirsiniz.
                </p>
                <button type="button" onClick={() => navigate("/login")}>
                    Giriş Yap
                </button>
            </section>
        </SiteLayout>
    );
}

export default Account;
