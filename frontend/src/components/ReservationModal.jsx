import { useEffect, useState } from "react";
import "./ReservationModal.css";

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "ARRIVED"];

const STATUS_LABELS = {
    PENDING: "Bekliyor",
    CONFIRMED: "Onaylandı",
    ARRIVED: "Geldi",
    COMPLETED: "Tamamlandı",
    CANCELLED: "İptal",
    NO_SHOW: "Gelmedi"
};

function toInputDateValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function buildInitialForm(initialData) {
    if (initialData) {
        return {
            customerName: initialData.customerName ?? "",
            customerPhone: initialData.customerPhone ?? "",
            customerEmail: initialData.customerEmail ?? "",
            reservationDate: initialData.reservationDate ?? "",
            // Backend "HH:mm" veya "HH:mm:ss" dönebilir, <input type="time"> için ilk 5 karakter yeterli.
            reservationTime: (initialData.reservationTime ?? "").slice(0, 5),
            guestCount: initialData.guestCount ?? 2,
            tableId: initialData.table?.id ?? "",
            note: initialData.note ?? ""
        };
    }
    return {
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        reservationDate: toInputDateValue(new Date()),
        reservationTime: "",
        guestCount: 2,
        tableId: "",
        note: ""
    };
}

// open: boolean
// mode: "create" | "edit"
// initialData: düzenlenen rezervasyon (ReservationResponseDTO) ya da null
// tables: gerçek masalar (GET /tables sonucu)
// onCancel: () => void
// onSubmit: (payload) => Promise  — POST/PUT çağrısını üst bileşen yapar
function ReservationModal({ open, mode, initialData, tables, onCancel, onSubmit }) {

    const [formData, setFormData] = useState(() => buildInitialForm(initialData));
    const [status, setStatus] = useState(initialData?.status ?? "PENDING");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [dateReservations, setDateReservations] = useState([]);

    useEffect(() => {
        setFormData(buildInitialForm(initialData));
        setStatus(initialData?.status ?? "PENDING");
        setError(null);
    }, [initialData, open]);

    // Seçilen tarihteki gerçek rezervasyonları çekip, seçilen saatte
    // hangi masaların dolu olduğunu buradan hesaplıyoruz (mock yok).
    useEffect(() => {
        if (!open || !formData.reservationDate) {
            setDateReservations([]);
            return;
        }
        let cancelled = false;
        const token = localStorage.getItem("token");
        fetch(`http://localhost:8080/reservations/date/${formData.reservationDate}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => (response.ok ? response.json() : []))
            .then((data) => {
                if (!cancelled) {
                    setDateReservations(data ?? []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setDateReservations([]);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [open, formData.reservationDate]);

    if (!open) {
        return null;
    }

    const busyTableIds = new Set(
        dateReservations
            .filter((reservation) =>
                reservation.reservationTime?.slice(0, 5) === formData.reservationTime &&
                ACTIVE_STATUSES.includes(reservation.status) &&
                reservation.id !== initialData?.id
            )
            .map((reservation) => reservation.table?.id)
    );

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const isStatusToggleable = status === "PENDING" || status === "CONFIRMED";

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.customerName.trim()) {
            setError("Müşteri adı boş olamaz.");
            return;
        }
        if (!formData.customerPhone.trim()) {
            setError("Telefon numarası boş olamaz.");
            return;
        }
        if (!formData.reservationDate || !formData.reservationTime) {
            setError("Tarih ve saat seçilmeli.");
            return;
        }
        if (!formData.tableId) {
            setError("Bir masa seçilmeli.");
            return;
        }
        if (Number(formData.guestCount) <= 0) {
            setError("Kişi sayısı 0'dan büyük olmalı.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await onSubmit({
                customerName: formData.customerName.trim(),
                customerPhone: formData.customerPhone.trim(),
                customerEmail: formData.customerEmail.trim() || null,
                reservationDate: formData.reservationDate,
                reservationTime: formData.reservationTime,
                guestCount: Number(formData.guestCount),
                tableId: Number(formData.tableId),
                status,
                note: formData.note.trim() || null
            });
        } catch (submitError) {
            console.error("Rezervasyon kaydedilirken hata:", submitError);
            setError(submitError.message || "Rezervasyon kaydedilemedi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="reservation-modal-backdrop" onClick={onCancel}>
            <div className="reservation-modal" onClick={(event) => event.stopPropagation()}>

                <div className="reservation-modal-header">
                    <h2>{mode === "edit" ? "Rezervasyonu Düzenle" : "Yeni Rezervasyon"}</h2>
                    <button type="button" className="reservation-modal-close" onClick={onCancel}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="reservation-modal-body">

                        <section>
                            <h3>Müşteri Bilgileri</h3>
                            <div className="reservation-modal-grid two-col">
                                <div className="reservation-field">
                                    <label htmlFor="res-name">Ad Soyad *</label>
                                    <input
                                        id="res-name"
                                        type="text"
                                        placeholder="Müşteri adını girin"
                                        value={formData.customerName}
                                        onChange={(event) => updateField("customerName", event.target.value)}
                                    />
                                </div>
                                <div className="reservation-field">
                                    <label htmlFor="res-phone">Telefon *</label>
                                    <input
                                        id="res-phone"
                                        type="tel"
                                        placeholder="+90 555 000 0000"
                                        value={formData.customerPhone}
                                        onChange={(event) => updateField("customerPhone", event.target.value)}
                                    />
                                </div>
                                <div className="reservation-field span-2">
                                    <label htmlFor="res-email">E-posta (opsiyonel)</label>
                                    <input
                                        id="res-email"
                                        type="email"
                                        placeholder="ornek@mail.com"
                                        value={formData.customerEmail}
                                        onChange={(event) => updateField("customerEmail", event.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3>Rezervasyon Bilgileri</h3>
                            <div className="reservation-modal-grid three-col">
                                <div className="reservation-field">
                                    <label htmlFor="res-date">Tarih *</label>
                                    <input
                                        id="res-date"
                                        type="date"
                                        value={formData.reservationDate}
                                        onChange={(event) => updateField("reservationDate", event.target.value)}
                                    />
                                </div>
                                <div className="reservation-field">
                                    <label htmlFor="res-time">Saat *</label>
                                    <input
                                        id="res-time"
                                        type="time"
                                        value={formData.reservationTime}
                                        onChange={(event) => updateField("reservationTime", event.target.value)}
                                    />
                                </div>
                                <div className="reservation-field">
                                    <label htmlFor="res-guests">Kişi Sayısı *</label>
                                    <input
                                        id="res-guests"
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={formData.guestCount}
                                        onChange={(event) => updateField("guestCount", event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="reservation-table-picker">
                                <div className="reservation-table-picker-header">
                                    <label>Masa *</label>
                                    <div className="reservation-table-legend">
                                        <span><span className="dot available"></span> Müsait</span>
                                        <span><span className="dot busy"></span> Dolu</span>
                                    </div>
                                </div>

                                <div className="reservation-table-grid">
                                    {tables.map((table) => {
                                        const isBusy = busyTableIds.has(table.id);
                                        const isSelected = Number(formData.tableId) === table.id;
                                        return (
                                            <button
                                                type="button"
                                                key={table.id}
                                                className={`reservation-table-card ${isSelected ? "selected" : ""} ${isBusy ? "busy" : ""}`}
                                                onClick={() => !isBusy && updateField("tableId", table.id)}
                                                disabled={isBusy}
                                            >
                                                <span className="material-symbols-outlined">table_restaurant</span>
                                                <strong>{table.tableNumber}</strong>
                                                <span className="reservation-table-capacity">{table.capacity} Kişi</span>
                                                <span className={`reservation-table-status ${isBusy ? "busy" : "available"}`}>
                                                    <span className="dot"></span>
                                                    {isBusy ? "Dolu" : "Müsait"}
                                                </span>
                                            </button>
                                        );
                                    })}

                                    {tables.length === 0 && (
                                        <p className="reservation-table-empty">Sistemde tanımlı masa yok.</p>
                                    )}
                                </div>
                            </div>

                            <div className="reservation-field">
                                <label htmlFor="res-note">Not</label>
                                <textarea
                                    id="res-note"
                                    rows="3"
                                    placeholder="Örn: Cam kenarı tercihi, alerjen durumu..."
                                    value={formData.note}
                                    onChange={(event) => updateField("note", event.target.value)}
                                />
                            </div>
                        </section>

                        {isStatusToggleable ? (
                            <section className="reservation-status-section">
                                <div>
                                    <h4>Rezervasyon Durumu</h4>
                                    <p>Müşteri talebini doğrudan onaylayabilirsiniz.</p>
                                </div>
                                <div className="reservation-status-toggle">
                                    <button
                                        type="button"
                                        className={status === "PENDING" ? "active" : ""}
                                        onClick={() => setStatus("PENDING")}
                                    >
                                        Bekliyor
                                    </button>
                                    <button
                                        type="button"
                                        className={status === "CONFIRMED" ? "active" : ""}
                                        onClick={() => setStatus("CONFIRMED")}
                                    >
                                        Onaylandı
                                    </button>
                                </div>
                            </section>
                        ) : (
                            <section className="reservation-status-section">
                                <div>
                                    <h4>Rezervasyon Durumu</h4>
                                    <p>Durum: <strong>{STATUS_LABELS[status] ?? status}</strong> — bu durumu listeden değiştirebilirsiniz.</p>
                                </div>
                            </section>
                        )}

                        {error && <p className="reservation-modal-error">{error}</p>}

                    </div>

                    <div className="reservation-modal-footer">
                        <button type="button" className="reservation-modal-cancel" onClick={onCancel} disabled={isSubmitting}>
                            Vazgeç
                        </button>
                        <button type="submit" className="reservation-modal-submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Kaydediliyor..."
                                : mode === "edit"
                                    ? "Değişiklikleri Kaydet"
                                    : "Rezervasyonu Oluştur"}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default ReservationModal;
