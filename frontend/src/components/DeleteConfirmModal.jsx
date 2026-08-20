import { useEffect } from "react";
import "./DeleteConfirmModal.css";

// Genel amaçlı, tekrar kullanılabilir onay modalı (window.confirm() yerine).
// variant="danger" (varsayılan): silme gibi geri alınamaz eylemler için kırmızı tema.
// variant="neutral": "Masayı Boşalt" gibi yıkıcı olmayan eylemler için primary/turuncu tema.

function DeleteConfirmModal({
    open,
    title = "Emin misiniz?",
    message,
    confirmLabel = "Sil",
    cancelLabel = "Vazgeç",
    confirmingLabel,
    isConfirming = false,
    variant = "danger",
    icon,
    onConfirm,
    onCancel
}) {

    const resolvedIcon = icon ?? (variant === "neutral" ? "table_restaurant" : "warning");
    const resolvedConfirmingLabel =
        confirmingLabel ?? (variant === "neutral" ? "İşleniyor..." : "Siliniyor...");

    useEffect(() => {

        if (!open) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onCancel();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };

    }, [open, onCancel]);


    if (!open) {
        return null;
    }

    return (

        <div className="delete-confirm-backdrop" onClick={onCancel}>

            <div
                className={`delete-confirm-modal ${variant}`}
                onClick={(event) => event.stopPropagation()}
            >

                <div className="delete-confirm-icon">
                    <span className="material-symbols-outlined">{resolvedIcon}</span>
                </div>

                <h3>{title}</h3>

                <p>{message}</p>

                <div className="delete-confirm-actions">

                    <button
                        type="button"
                        className="delete-confirm-cancel"
                        onClick={onCancel}
                        disabled={isConfirming}
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        className="delete-confirm-confirm"
                        onClick={onConfirm}
                        disabled={isConfirming}
                    >
                        {isConfirming ? resolvedConfirmingLabel : confirmLabel}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteConfirmModal;
