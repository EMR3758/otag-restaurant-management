import SiteLayout from "../components/SiteLayout";
import SitePageHeader from "../components/SitePageHeader";
import { heroImage } from "../data/siteData";
import "./About.css";

const VALUES = [
    {
        icon: "eco",
        title: "Taze Malzeme",
        description: "Her gün yerel tedarikçilerden gelen taze malzemelerle pişiriyoruz."
    },
    {
        icon: "handshake",
        title: "Sıcak Konukseverlik",
        description: "Her misafirimizi kendi evimizdeymiş gibi ağırlıyoruz."
    },
    {
        icon: "auto_awesome",
        title: "Özenli Sunum",
        description: "Her tabak, şeflerimizin özeniyle titizlikle hazırlanır."
    }
];

function About() {
    return (
        <SiteLayout>
            <SitePageHeader
                eyebrow="Hikayemiz"
                title="Otağ Cafe Hakkında"
                description="Geleneksel lezzetleri modern bir konukseverlik anlayışıyla buluşturan, sıcak ve samimi bir cafe deneyimi."
            />

            <section className="about-story site-container">
                <div className="about-story-media">
                    <img src={heroImage} alt="Otağ Cafe iç mekan" />
                </div>
                <div className="about-story-text">
                    <h2>Sıcaklığın ve Lezzetin Adresi</h2>
                    <p>
                        Otağ Cafe, şehrin gürültüsünden uzaklaşıp kendinize vakit
                        ayırabileceğiniz, sevdiklerinizle keyifli anlar geçirebileceğiniz bir
                        buluşma noktası olarak kuruldu. Mutfağımızda hazırlanan her lezzet,
                        özenle seçilmiş malzemeler ve tutkuyla harmanlanır.
                    </p>
                    <p>
                        Amacımız sadece güzel bir yemek sunmak değil, misafirlerimize
                        unutulmaz bir konukseverlik deneyimi yaşatmak.
                    </p>
                </div>
            </section>

            <section className="about-values site-container">
                {VALUES.map((value) => (
                    <div className="about-value-card" key={value.title}>
                        <span className="material-symbols-outlined">{value.icon}</span>
                        <h3>{value.title}</h3>
                        <p>{value.description}</p>
                    </div>
                ))}
            </section>
        </SiteLayout>
    );
}

export default About;
