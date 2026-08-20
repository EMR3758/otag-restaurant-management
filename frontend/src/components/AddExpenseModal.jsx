import { useEffect, useState } from "react";
import "./AddExpenseModal.css";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, todayStr } from "../pages/Finance/financeMockData.js";

const EMPTY_FORM = {
    name: "",
    category: "",
    amount: "",
    paymentMethod: "",
    date: todayStr(),
    description: ""
};

// mode: "create" | "edit" | "view" (view salt-okunur açılır, "Düzenle" ile edit'e geçer)
// expense: düzenlenecek/görüntülenecek kayıt (create'te null)
// onSubmit: (formValues) => Promise
// onCancel: () => void
function AddExpenseModal({ open, mode = "create", expense, onCancel, onSubmit }) {

    const [form, setForm] = useState(EMPTY_FORM);
    const [readOnly, setReadOnly] = useState(mode === "view");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        setReadOnly(mode === "view");
        setError(null);

        if (expense) {
            setForm({
                name: expense.name,
                category: expense.category,
                amount: String(expense.amount),
                paymentMethod: expense.paymentMethod,
                date: expense.date,
                description: expense.description ?? ""
            });
        } else {
            setForm(EMPTY_FORM);
        }
    }, [open, mode, expense]);

    if (!open) {
        return null;
    }

    const isCreating = mode === "create";

    const updateField = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (readOnly) {
            return;
        }

        if (!form.name.trim()) {
            setError("Gider adı zorunludur.");
            return;
        }
        if (!form.category) {
            setError("Kategori seçmelisiniz.");
            return;
        }
        if (!(Number(form.amount) > 0)) {
            setError("Tutar 0'dan büyük olmalı.");
            return;
        }
        if (!form.paymentMethod) {
            setError("Ödeme yöntemi seçmelisiniz.");
            return;
        }
        if (!form.date) {
            setError("Tarih zorunludur.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit(form);
        } catch (submitError) {
            console.error("Gider kaydedilirken hata:", submitError);
            setError(submitError.message || "Gider kaydedilemedi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalTitle = isCreating ? "Gider Ekle" : readOnly ? "Gider Detayı" : "Gideri Düzenle";

    return (
        <div className="expense-modal-backdrop" onClick={onCancel}>
            <div className="expense-modal" onClick={(event) => event.stopPropagation()}>

                <div className="expense-modal-header">
                    <h2>{modalTitle}</h2>
                    <button type="button" className="expense-modal-close" onClick={onCancel}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="expense-modal-body">

                        <div className="expense-field">
                            <label htmlFor="expense-name">Gider Adı</label>
                            <input
                                id="expense-name"
                                type="text"
                                placeholder="Örn: Elektrik Faturası"
                                value={form.name}
                                onChange={updateField("name")}
                                disabled={readOnly}
                            />
                        </div>

                        <div className="expense-field-grid">

                            <div className="expense-field">
                                <label htmlFor="expense-category">Kategori</label>
                                <select
                                    id="expense-category"
                                    value={form.category}
                                    onChange={updateField("category")}
                                    disabled={readOnly}
                                >
                                    <option value="" disabled>Kategori Seçin</option>
                                    {EXPENSE_CATEGORIES.map((category) => (
                                        <option value={category.value} key={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="expense-field">
                                <label htmlFor="expense-amount">Tutar</label>
                                <div className="expense-amount-input">
                                    <span className="expense-currency-prefix">₺</span>
                                    <input
                                        id="expense-amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={form.amount}
                                        onChange={updateField("amount")}
                                        disabled={readOnly}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="expense-field-grid">

                            <div className="expense-field">
                                <label htmlFor="expense-payment-method">Ödeme Yöntemi</label>
                                <select
                                    id="expense-payment-method"
                                    value={form.paymentMethod}
                                    onChange={updateField("paymentMethod")}
                                    disabled={readOnly}
                                >
                                    <option value="" disabled>Ödeme Yöntemi Seçin</option>
                                    {PAYMENT_METHODS.map((method) => (
                                        <option value={method.value} key={method.value}>
                                            {method.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="expense-field">
                                <label htmlFor="expense-date">Tarih</label>
                                <input
                                    id="expense-date"
                                    type="date"
                                    value={form.date}
                                    onChange={updateField("date")}
                                    disabled={readOnly}
                                />
                            </div>

                        </div>

                        <div className="expense-field">
                            <label htmlFor="expense-description">Açıklama</label>
                            <textarea
                                id="expense-description"
                                rows="3"
                                placeholder="Gider ile ilgili ek notlar..."
                                value={form.description}
                                onChange={updateField("description")}
                                disabled={readOnly}
                            />
                        </div>

                        {error && <p className="expense-modal-error">{error}</p>}

                    </div>

                    <div className="expense-modal-footer">

                        {readOnly ? (
                            <>
                                <button type="button" className="expense-modal-cancel" onClick={onCancel}>
                                    KAPAT
                                </button>
                                <button
                                    type="button"
                                    className="expense-modal-submit"
                                    onClick={() => setReadOnly(false)}
                                >
                                    DÜZENLE
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="expense-modal-cancel"
                                    onClick={onCancel}
                                    disabled={isSubmitting}
                                >
                                    İPTAL
                                </button>
                                <button
                                    type="submit"
                                    className="expense-modal-submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "KAYDEDİLİYOR..." : "GİDERİ KAYDET"}
                                </button>
                            </>
                        )}

                    </div>

                </form>

            </div>
        </div>
    );
}

export default AddExpenseModal;
