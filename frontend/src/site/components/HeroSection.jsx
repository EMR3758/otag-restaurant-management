import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

function HeroSection({ imageUrl }) {
    const navigate = useNavigate();
    return (
        <section className="hero-section">
            <div className="hero-media">
                <img src={imageUrl} alt="Otağ Cafe iç mekan" />
                <div className="hero-overlay" />
            </div>

            <div className="hero-card">
                <h1>Lezzetin ve Keyfin Buluştuğu Otağ</h1>
                <p>
                    Otağ Cafe'de sevdiklerinizle keyifli anlar, özel lezzetler ve
                    sıcak bir atmosfer sizi bekliyor.
                </p>

                <div className="hero-actions">
                    <button
                        type="button"
                        className="hero-button hero-button-primary"
                        onClick={() => navigate("/full-menu")}
                    >
                        Menüyü Keşfet
                    </button>
                    <button
                        type="button"
                        className="hero-button hero-button-secondary"
                        onClick={() => navigate("/reservation")}
                    >
                        Rezervasyon Yap
                    </button>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
