import { useEffect, useState } from "react";
import "./StockMovementModal.css";

// mode: "CREATE" (yeni stok kalemi) | "INCREASE" (+ buton) | "DECREASE" (- buton)
// item: INCREASE/DECREASE için hedef stok kalemi (CREATE'de null)
// onCancel: () => void
// onSubmit: (payload) => Promise
//   CREATE     -> { productName, quantity, minimumQuantity }
//   INCREASE/DECREASE -> { amount }
function StockMovementModal({ open, mode, item, onCancel, onSubmit }) {

    const isCreate = mode === "CREATE";
    const isIncrease = mode === "INCREASE";

    const [productName, setProductName] = useState("");
    const [initialQuantity, setInitialQuantity] = useState("");
    const [minimumQuantity, setMinimumQuantity] = useState("");

    const [amount, setAmount] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            setProductName("");
            setInitialQuantity("");
            setMinimumQuantity("");
            setAmount("");
            setError(null);
        }
    }, [open, mode, item]);

    if (!open) {
        return null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isCreate) {
            if (!productName.trim()) {
                setError("Ürün adı girmelisiniz.");
                return;
            }
            const quantityValue = Number(initialQuantity);
            const minimumValue = Number(minimumQuantity);
            if (!(quantityValue >= 0)) {
                setError("Başlangıç stok miktarı 0 veya daha büyük olmalı.");
                return;
            }
            if (!(minimumValue >= 0)) {
                setError("Minimum stok miktarı 0 veya daha büyük olmalı.");
                return;
            }

            setIsSubmitting(true);
            setError(null);
            try {
                await onSubmit({
                    productName: productName.trim(),
                    quantity: quantityValue,
                    minimumQuantity: minimumValue
                });
            } catch (submitError) {
                console.error("Stok kalemi oluşturulurken hata:", submitError);
                setError(submitError.message || "Stok kalemi oluşturulamadı.");
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        const numericAmount = Number(amount);
        if (!(numericAmount > 0)) {
            setError("Miktar 0'dan büyük olmalı.");
            return;
        }
        if (!isIncrease && item && numericAmount > Number(item.quantity)) {
            setError("Çıkış miktarı mevcut stoktan fazla olamaz.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit({ amount: numericAmount });
        } catch (submitError) {
            console.error("Stok miktarı güncellenirken hata:", submitError);
            setError(submitError.message || "Stok miktarı güncellenemedi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = isCreate ? "Yeni Stok Kalemi" : isIncrease ? "Stok Girişi" : "Stok Çıkışı";

    return (
        <div className="stock-modal-backdrop" onClick={onCancel}>
            <div className="stock-modal" onClick={(event) => event.stopPropagation()}>

                <div className="stock-modal-header">
                    <h3>{title}</h3>
                    <button type="button" className="stock-modal-close" onClick={onCancel}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="stock-modal-body">

                        {isCreate ? (
                            <>
                                <div className="stock-field">
                                    <label htmlFor="stock-product-name">Ürün Adı</label>
                                    <input
                                        id="stock-product-name"
                                        type="text"
                                        value={productName}
                                        onChange={(event) => setProductName(event.target.value)}
                                        placeholder="Örn: Filtre Kahve"
                                        autoFocus
                                    />
                                </div>

                                <div className="stock-modal-grid">
                                    <div className="stock-field">
                                        <label htmlFor="stock-initial-quantity">Başlangıç Stok</label>
                                        <input
                                            id="stock-initial-quantity"
                                            type="number"
                                            min="0"
                                            step="any"
                                            value={initialQuantity}
                                            onChange={(event) => setInitialQuantity(event.target.value)}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="stock-field">
                                        <label htmlFor="stock-minimum-quantity">Minimum Stok</label>
                                        <input
                                            id="stock-minimum-quantity"
                                            type="number"
                                            min="0"
                                            step="any"
                                            value={minimumQuantity}
                                            onChange={(event) => setMinimumQuantity(event.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="stock-field">
                                    <label>Ürün</label>
                                    <div className="stock-readonly-value">
                                        {item?.productName ?? "—"}
                                    </div>
                                </div>

                                <div className="stock-modal-grid">
                                    <div className="stock-field">
                                        <label>Mevcut Stok</label>
                                        <div className="stock-readonly-value">
                                            {item ? item.quantity : "—"}
                                        </div>
                                    </div>

                                    <div className="stock-field">
                                        <label htmlFor="stock-amount">
                                            {isIncrease ? "Eklenecek Miktar" : "Çıkış Miktarı"}
                                        </label>
                                        <input
                                            id="stock-amount"
                                            type="number"
                                            min="0"
                                            step="any"
                                            value={amount}
                                            onChange={(event) => setAmount(event.target.value)}
                                            placeholder="0"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {error && <p className="stock-modal-error">{error}</p>}

                    </div>

                    <div className="stock-modal-footer">
                        <button type="button" className="stock-modal-cancel" onClick={onCancel} disabled={isSubmitting}>
                            Vazgeç
                        </button>
                        <button
                            type="submit"
                            className={`stock-modal-submit ${isIncrease || isCreate ? "entry" : "exit"}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Kaydediliyor..."
                                : isCreate ? "Oluştur" : isIncrease ? "Stok Ekle" : "Stok Çıkar"}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default StockMovementModal;
