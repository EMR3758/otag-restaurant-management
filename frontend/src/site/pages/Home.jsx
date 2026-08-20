  import SiteLayout from "../components/SiteLayout";
import HeroSection from "../components/HeroSection";
import QuickActions from "../components/QuickActions";
import FeaturedProducts from "../components/FeaturedProducts";
import CategoryShowcase from "../components/CategoryShowcase";
import CampaignBanner from "../components/CampaignBanner";
import { featuredProducts, categories, campaign, heroImage } from "../data/siteData";

function Home() {
    const handleAddToCart = (product) => {
        // Sepet sistemi devreye alındığında burada global cart state'ine
        // (ör. CartContext) ekleme yapılacak. Şimdilik hazır bir hook noktası.
        console.log("Sepete eklendi:", product.name);
    };

    return (
        <SiteLayout>
            <HeroSection imageUrl={heroImage} />
            <QuickActions />
            <FeaturedProducts products={featuredProducts} onAddToCart={handleAddToCart} />
            <CategoryShowcase categories={categories} />
            <CampaignBanner campaign={campaign} />
        </SiteLayout>
    );
}

export default Home;
