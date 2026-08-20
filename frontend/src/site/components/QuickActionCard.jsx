import { useNavigate } from "react-router-dom";
import "./QuickActionCard.css";

function QuickActionCard({ icon, label, to }) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            className="quick-action-card"
            onClick={() => navigate(to)}
        >
            <span className="quick-action-icon">
                <span className="material-symbols-outlined">{icon}</span>
            </span>
            <span className="quick-action-label">{label}</span>
        </button>
    );
}

export default QuickActionCard;
