import { useNavigate } from "react-router-dom";
import "./CampaignBanner.css";

function CampaignBanner({ campaign }) {
    const navigate = useNavigate();
    const { tag, title, description, ctaLabel, imageUrl } = campaign;

    return (
        <section className="campaign-banner site-container">
            <div className="campaign-banner-card">
                <div className="campaign-banner-glow campaign-banner-glow-top" />
                <div className="campaign-banner-glow campaign-banner-glow-bottom" />

                <div className="campaign-banner-content">
                    <span className="campaign-banner-tag">{tag}</span>
                    <h2>{title}</h2>
                    <p>{description}</p>
                    <button
                        type="button"
                        className="campaign-banner-button"
                        onClick={() => navigate("/full-menu")}
                    >
                        {ctaLabel}
                    </button>
                </div>

                <div className="campaign-banner-media">
                    <img src={imageUrl} alt={title} />
                </div>
            </div>
        </section>
    );
}

export default CampaignBanner;
