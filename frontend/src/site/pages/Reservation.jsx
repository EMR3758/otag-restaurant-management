import { useState } from "react";
import SiteLayout from "../components/SiteLayout";
import SitePageHeader from "../components/SitePageHeader";
import "./Reservation.css";

const INITIAL_FORM = {
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    note: ""
};

function Reservation() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Rezervasyon API'si eklendiğinde burada backend'e POST atılacak.
        setSubmitted(true);
    };

    return (
        <SiteLayout>
            <SitePageHeader
                eyebrow="Rezervasyon"
                title="Masanızı Ayırtın"
                description="Aşağıdaki formu doldurun, ekibimiz en kısa sürede sizinle iletişime geçsin."
            />

            <section className="reservation-section site-container">
                <div className="reservation-card">
                    {submitted ? (
                        <div className="reservation-success">
                            <span className="material-symbols-outlined">check_circle</span>
                            <h3>Talebiniz Alındı</h3>
                            <p>
                                Rezervasyon talebiniz için teşekkür ederiz. Ekibimiz kısa süre
                                içinde sizinle iletişime geçecek.
                            </p>
                            <button
                                type="button"
                                className="reservation-again-button"
                                onClick={() => {
                                    setForm(INITIAL_FORM);
                                    setSubmitted(false);
                                }}
                            >
                                Yeni Rezervasyon Oluştur
                            </button>
                        </div>
                    ) : (
                        <form className="reservation-form" onSubmit={handleSubmit}>
                            <div className="reservation-field">
                                <label htmlFor="res-name">Ad Soyad</label>
                                <input
                                    id="res-name"
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={handleChange("name")}
                                    placeholder="Adınız Soyadınız"
                                />
                            </div>

                            <div className="reservation-field">
                                <label htmlFor="res-phone">Telefon</label>
                                <input
                                    id="res-phone"
                                    type="tel"
                                    required
                                    value={form.phone}
                                    onChange={handleChange("phone")}
                                    placeholder="0 5xx xxx xx xx"
                                />
                            </div>

                            <div className="reservation-row">
                                <div className="reservation-field">
                                    <label htmlFor="res-date">Tarih</label>
                                    <input
                                        id="res-date"
                                        type="date"
                                        required
                                        value={form.date}
                                        onChange={handleChange("date")}
                                    />
                                </div>

                                <div className="reservation-field">
                                    <label htmlFor="res-time">Saat</label>
                                    <input
                                        id="res-time"
                                        type="time"
                                        required
                                        value={form.time}
                                        onChange={handleChange("time")}
                                    />
                                </div>
                            </div>

                            <div className="reservation-field">
                                <label htmlFor="res-guests">Kişi Sayısı</label>
                                <select
                                    id="res-guests"
                                    value={form.guests}
                                    onChange={handleChange("guests")}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                                        <option key={count} value={count}>
                                            {count} Kişi
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="reservation-field">
                                <label htmlFor="res-note">Not (opsiyonel)</label>
                                <textarea
                                    id="res-note"
                                    rows={3}
                                    value={form.note}
                                    onChange={handleChange("note")}
                                    placeholder="Özel bir isteğiniz varsa belirtebilirsiniz."
                                />
                            </div>

                            <button type="submit" className="reservation-submit-button">
                                Rezervasyonu Gönder
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </SiteLayout>
    );
}

export default Reservation;
