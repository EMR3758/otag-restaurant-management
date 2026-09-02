import SiteLayout from "../components/SiteLayout";
import HeroSection from "../components/HeroSection";
import QuickActions from "../components/QuickActions";
import FeaturedProducts from "../components/FeaturedProducts";
import { heroImage } from "../data/siteData";
import { useSitePopularProducts } from "../data/useSiteProducts";

function Home() {
    const { products, loading, error } = useSitePopularProducts(4);
    return (
        <SiteLayout>
            <HeroSection imageUrl={heroImage} />
            <QuickActions />
            {loading ? (
                <p className="site-status-message">Menü yükleniyor...</p>
            ) : error ? (
                <p className="site-status-message">{error}</p>
            ) : (
                <FeaturedProducts products={products} />
            )}
        </SiteLayout>
    );
}
export default Home;
