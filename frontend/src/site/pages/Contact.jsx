import { useState } from "react";
import SiteLayout from "../components/SiteLayout";
import SitePageHeader from "../components/SitePageHeader";
import { SITE_CONTACT } from "../data/siteContact";
import "./Contact.css";

const CONTACT_MESSAGES_ENDPOINT = "http://localhost:8080/contact-messages";

const INITIAL_FORM = { name: "", email: "", message: "" };
const CONTACT_ITEMS = [
    {
        icon: "location_on",
        title: "Adres",
        value: `${SITE_CONTACT.addressLines[0]} ${SITE_CONTACT.addressLines[1]}`
    },
    {
        icon: "call",
        title: "Telefon",
        value: SITE_CONTACT.phoneDisplay,
        href: SITE_CONTACT.phoneHref
    },
    {
        icon: "mail",
        title: "E-posta",
        value: SITE_CONTACT.email,
        href: SITE_CONTACT.emailHref
    },
    {
        icon: "photo_camera",
        title: "Instagram",
        value: SITE_CONTACT.instagramHandle,
        href: SITE_CONTACT.instagramHref
    },
    {
        icon: "chat",
        title: "WhatsApp",
        value: SITE_CONTACT.whatsappDisplay,
        href: SITE_CONTACT.whatsappHref
    }
];

function Contact() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitState, setSubmitState] = useState(null); // "success" | "error" | null
    const [submitError, setSubmitError] = useState("");

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitState(null);
        setSubmitError("");
        setIsSubmitting(true);

        try {
            const response = await fetch(CONTACT_MESSAGES_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    message: form.message.trim()
                })
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => null);
                throw new Error(errorBody?.message || "Mesajınız gönderilemedi. Lütfen tekrar deneyin.");
            }

            setSubmitState("success");
            setForm(INITIAL_FORM);
        } catch (error) {
            console.error("İletişim mesajı gönderilirken hata:", error);
            setSubmitState("error");
            setSubmitError(error.message || "Mesajınız gönderilemedi. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                {item.href ? (
                                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                                        {item.value}
                                    </a>
                                ) : (
                                    <p>{item.value}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="contact-field">
                        <label htmlFor="contact-name">Ad Soyad</label>
                        <input
                            id="contact-name"
                            type="text"
                            required
                            placeholder="Adınız Soyadınız"
                            value={form.name}
                            onChange={handleChange("name")}
                        />
                    </div>
                    <div className="contact-field">
                        <label htmlFor="contact-email">E-posta</label>
                        <input
                            id="contact-email"
                            type="email"
                            required
                            placeholder="ornek@eposta.com"
                            value={form.email}
                            onChange={handleChange("email")}
                        />
                    </div>
                    <div className="contact-field">
                        <label htmlFor="contact-message">Mesajınız</label>
                        <textarea
                            id="contact-message"
                            rows={4}
                            required
                            placeholder="Mesajınızı yazın..."
                            value={form.message}
                            onChange={handleChange("message")}
                        />
                    </div>

                    {submitState === "success" && (
                        <p className="contact-form-success">
                            Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.
                        </p>
                    )}
                    {submitState === "error" && (
                        <p className="contact-form-error">{submitError}</p>
                    )}

                    <button type="submit" className="contact-submit-button" disabled={isSubmitting}>
                        {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                    </button>
                </form>
            </section>
        </SiteLayout>
    );
}

export default Contact;
