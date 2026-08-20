import QuickActionCard from "./QuickActionCard";
import "./QuickActions.css";

const QUICK_ACTIONS = [
    { icon: "restaurant_menu", label: "Menüye Git", to: "/full-menu" },
    { icon: "table_bar", label: "Masa Rezervasyonu", to: "/reservation" },
    { icon: "takeout_dining", label: "Online Sipariş", to: "/full-menu" },
    { icon: "call", label: "Bize Ulaşın", to: "/contact" }
];

function QuickActions() {
    return (
        <section className="quick-actions site-container">
            <div className="quick-actions-grid">
                {QUICK_ACTIONS.map((action) => (
                    <QuickActionCard key={action.label} {...action} />
                ))}
            </div>
        </section>
    );
}

export default QuickActions;
