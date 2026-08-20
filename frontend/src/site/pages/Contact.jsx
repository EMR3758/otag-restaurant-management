import SiteLayout from "../components/SiteLayout";
import SitePageHeader from "../components/SitePageHeader";
import "./Contact.css";

const CONTACT_ITEMS = [
    { icon: "location_on", title: "Adres", value: "Otağ Mahallesi, Kahve Sokak No:12, İstanbul" },
    { icon: "call", title: "Telefon", value: "+90 212 555 01 23" },
    { icon: "mail", title: "E-posta", value: "info@otagcafe.com" },
    { icon: "schedule", title: "Çalışma Saatleri", value: "Her gün 08:00 - 23:00" }
];

function Contact() {
    return (
        <SiteLayout>
            <SitePageHeader
                eyebrow="İletişim"
                title="Bize Ulaşın"
                description="Sorularınız, önerileriniz ya da özel etkinlik talepleriniz için bizimle iletişime geçebilirsiniz."
            />

            <section className="contact-section site-container">
                <div className="contact-info">
                    {CONTACT_ITEMS.map((item) => (
                        <div className="contact-info-item" key={item.title}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <div>
                                <h4>{item.title}</h4>
                                <p>{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
                    <div className="contact-field">
                        <label htmlFor="contact-name">Ad Soyad</label>
                        <input id="contact-name" type="text" required placeholder="Adınız Soyadınız" />
                    </div>
                    <div className="contact-field">
                        <label htmlFor="contact-email">E-posta</label>
                        <input id="contact-email" type="email" required placeholder="ornek@eposta.com" />
                    </div>
                    <div className="contact-field">
                        <label htmlFor="contact-message">Mesajınız</label>
                        <textarea id="contact-message" rows={4} required placeholder="Mesajınızı yazın..." />
                    </div>
                    <button type="submit" className="contact-submit-button">
                        Gönder
                    </button>
                </form>
            </section>
        </SiteLayout>
    );
}

export default Contact;
