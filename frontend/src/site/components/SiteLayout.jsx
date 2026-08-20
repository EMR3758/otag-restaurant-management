import SiteNavbar from "./SiteNavbar";
import BottomNav from "./BottomNav";
import SiteFooter from "./SiteFooter";
import "../theme.css";
import "./SiteLayout.css";

function SiteLayout({ children }) {
    return (
        <div className="otag-site">
            <SiteNavbar />

            <main className="site-main">{children}</main>

            <SiteFooter />
            <BottomNav />
        </div>
    );
}

export default SiteLayout;
