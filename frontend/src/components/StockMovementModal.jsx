import { useEffect, useState } from "react";
import "./StockMovementModal.css";

// mode: "IN" (Stok Girişi) | "OUT" (Stok Çıkışı)
// items: tüm stok kalemleri (header'daki "+ Stok Girişi" ürün seçimi için)
// initialItemId: satırdan tetiklendiyse önceden seçili/kilitli ürün
// onCancel: () => void
// onSubmit: (stockItemId, amount, note) => Promise
function StockMovementModal({ open, mode, items, initialItemId, onCancel, onSubmit }) {

    const [selectedItemId, setSelectedItemId] = useState(initialItemId ?? "");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            setSelectedItemId(initialItemId ?? "");
            setAmount("");
            setNote("");
            setError(null);
        }
    }, [open, initialItemId]);

    if (!open) {
        return null;
    }

    const selectedItem = items.find((item) => item.id === Number(selectedItemId));
    const isEntry = mode === "IN";

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedItemId) {
            setError("Bir ürün seçmelisiniz.");
            return;
        }
        const numericAmount = Number(amount);
        if (!(numericAmount > 0)) {
            setError("Miktar 0'dan büyük olmalı.");
            return;
        }
        if (!isEntry && selectedItem && numericAmount > selectedItem.currentStock) {
            setError("Çıkış miktarı mevcut stoktan fazla olamaz.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit(Number(selectedItemId), numericAmount, note);
        } catch (submitError) {
            console.error("Stok hareketi kaydedilirken hata:", submitError);
            setError(submitError.message || "Stok hareketi kaydedilemedi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="stock-modal-backdrop" onClick={onCancel}>
            <div className="stock-modal" onClick={(event) => event.stopPropagation()}>

                <div className="stock-modal-header">
                    <h3>{isEntry ? "Stok Girişi" : "Stok Çıkışı"}</h3>
                    <button type="button" className="stock-modal-close" onClick={onCancel}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="stock-modal-body">

                        <div className="stock-field">
                            <label htmlFor="stock-product">Ürün</label>
                            <select
                                id="stock-product"
                                value={selectedItemId}
                                onChange={(event) => setSelectedItemId(event.target.value)}
                                disabled={!!initialItemId}
                            >
                                <option value="" disabled>Ürün seçin</option>
                                {items.map((item) => (
                                    <option value={item.id} key={item.id}>
                                        {item.productName} ({item.category})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="stock-modal-grid">
                            <div className="stock-field">
                                <label>Mevcut Stok</label>
                                <div className="stock-readonly-value">
                                    {selectedItem ? `${selectedItem.currentStock} ${selectedItem.unit}` : "—"}
                                </div>
                            </div>

                            <div className="stock-field">
                                <label htmlFor="stock-amount">
                                    {isEntry ? "Eklenecek Miktar" : "Çıkış Miktarı"}
                                </label>
                                <div className="stock-amount-input">
                                    <input
                                        id="stock-amount"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={amount}
                                        onChange={(event) => setAmount(event.target.value)}
                                        placeholder="0"
                                    />
                                    <span className="stock-unit-suffix">{selectedItem?.unit ?? ""}</span>
                                </div>
                            </div>
                        </div>

                        <div className="stock-field">
                            <label htmlFor="stock-note">{isEntry ? "Not" : "Çıkış Nedeni"}</label>
                            <textarea
                                id="stock-note"
                                rows="3"
                                placeholder={isEntry ? "Örn: Haftalık tedarikçi alımı" : "Örn: Mutfak kullanımı, fire..."}
                                value={note}
                                onChange={(event) => setNote(event.target.value)}
                            />
                        </div>

                        {error && <p className="stock-modal-error">{error}</p>}

                    </div>

                    <div className="stock-modal-footer">
                        <button type="button" className="stock-modal-cancel" onClick={onCancel} disabled={isSubmitting}>
                            Vazgeç
                        </button>
                        <button
                            type="submit"
                            className={`stock-modal-submit ${isEntry ? "entry" : "exit"}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Kaydediliyor..." : isEntry ? "Stok Ekle" : "Stok Çıkar"}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default StockMovementModal;
