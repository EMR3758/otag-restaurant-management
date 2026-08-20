import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTables.css";

// Yeni masalar varsayılan olarak "Bahçe Masaları" bölümünde (BAHCE / NORMAL)
// görünür hale gelsin diye eklenir; Tables.jsx bu ikisinin kombinasyonuna göre
// gruplama yapıyor ve tasarımda bu alanlar için ayrı bir seçim alanı yok.
const DEFAULT_TABLE_TYPE = "NORMAL";
const DEFAULT_LOCATION = "BAHCE";

function authHeaders() {
    return {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
}

function AddTables() {

    const navigate = useNavigate();

    const [tableNumber, setTableNumber] = useState("");
    const [capacity, setCapacity] = useState("");
    const [available, setAvailable] = useState(true);

    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);


    // =====================================================
    // GÖNDER
    // =====================================================

    const validate = () => {

        const nextErrors = {};

        if (!tableNumber.trim()) {
            nextErrors.tableNumber = "Masa numarası zorunludur.";
        }

        if (capacity === "" || Number(capacity) < 1 || Number.isNaN(Number(capacity))) {
            nextErrors.capacity = "Geçerli bir oturma kapasitesi girin.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSaving(true);

        const payload = {
            tableNumber: tableNumber.trim(),
            capacity: Number(capacity),
            tableType: DEFAULT_TABLE_TYPE,
            location: DEFAULT_LOCATION,
            available
        };

        try {

            const response = await fetch("http://localhost:8080/tables", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Masa kaydedilemedi");
            }

            navigate("/tables");

        } catch (error) {
            console.error("Table save error:", error);
            alert("Masa kaydedilirken bir hata oluştu.");
        } finally {
            setIsSaving(false);
        }

    };

    const handleCancel = () => {
        navigate("/tables");
    };

    const handleToggleAvailable = () => {
        setAvailable((prev) => !prev);
    };


    return (
        <div className="add-table-page">

            {/* =================================================
                MİNİMAL ÜST BAR
            ================================================= */}

            <header className="add-table-topbar">

                <button
                    type="button"
                    className="back-to-tables-button"
                    onClick={handleCancel}
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Masalara Dön
                </button>

                <div className="add-table-wordmark">OTAĞ</div>

                <div className="add-table-topbar-spacer" />

            </header>

            {/* =================================================
                ORTALANMIŞ FORM KARTI
            ================================================= */}

            <main className="add-table-main">

                <div className="add-table-card">

                    <div className="add-table-card-head">

                        <div className="add-table-icon">
                            <span className="material-symbols-outlined">table_restaurant</span>
                        </div>

                        <h1>Yeni Masa Ekle</h1>
                        <p>Yeni bir oturma alanı için detayları yapılandırın.</p>

                    </div>

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="form-field">
                            <label htmlFor="table_number">
                                Masa Numarası <span className="required">*</span>
                            </label>
                            <input
                                id="table_number"
                                type="text"
                                placeholder="örn. 01, Balkon-A"
                                value={tableNumber}
                                onChange={(event) => setTableNumber(event.target.value)}
                            />
                            {errors.tableNumber && <span className="field-error">{errors.tableNumber}</span>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="capacity">
                                Oturma Kapasitesi <span className="required">*</span>
                            </label>
                            <div className="input-icon-wrap">
                                <span className="material-symbols-outlined">group</span>
                                <input
                                    id="capacity"
                                    type="number"
                                    min="1"
                                    placeholder="örn. 4"
                                    value={capacity}
                                    onChange={(event) => setCapacity(event.target.value)}
                                />
                            </div>
                            {errors.capacity && <span className="field-error">{errors.capacity}</span>}
                        </div>

                        <hr className="form-divider" />

                        <div
                            className="available-toggle-row"
                            onClick={handleToggleAvailable}
                        >
                            <div className="available-toggle-text">
                                <span className="available-toggle-title">Müsait</span>
                                <span className="available-toggle-desc">
                                    Bu masayı restoran siparişleri için müsait olarak işaretleyin.
                                </span>
                            </div>

                            <button
                                type="button"
                                role="switch"
                                aria-checked={available}
                                className={`toggle-switch ${available ? "on" : "off"}`}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleToggleAvailable();
                                }}
                            >
                                <span className="toggle-knob" />
                            </button>
                        </div>

                        <div className="form-actions">

                            <button type="button" className="secondary-button" onClick={handleCancel}>
                                İptal
                            </button>

                            <button type="submit" className="primary-button" disabled={isSaving}>
                                <span className="material-symbols-outlined">check</span>
                                {isSaving ? "Kaydediliyor..." : "Masayı Kaydet"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default AddTables;
