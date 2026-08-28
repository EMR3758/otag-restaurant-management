import "./StockDetailModal.css";

// Tamamen sunum (presentational) bileşeni: veri çekme işini Stock.jsx yapar,
// bu component sadece kendisine verilen item/status'ü gösterir.
//
// item: null ise kapalı, doluysa açık — { id, productName, quantity, minimumQuantity }
// status: "NORMAL" | "CRITICAL" | "OUT_OF_STOCK"
// statusLabel: ekranda gösterilecek Türkçe metin
function StockDetailModal({ item, status, statusLabel, onClose, onRequestEntry, onRequestExit }) {

    if (!item) {
        return null;
    }

    return (
        <div className="stock-detail-backdrop" onClick={onClose}>
            <div className="stock-detail-modal" onClick={(event) => event.stopPropagation()}>

                <div className="stock-detail-header">
                    <div>
                        <div className="stock-detail-title-row">
                            <h3>{item.productName}</h3>
                            <span className={`stock-status-badge status-${status.toLowerCase()}`}>
                                <span className="dot"></span>
                                {statusLabel}
                            </span>
                        </div>
                    </div>
                    <button type="button" className="stock-detail-close" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="stock-detail-body">

                    <div className="stock-detail-grid">
                        <div className="stock-detail-card highlight">
                            <span>Mevcut Stok</span>
                            <strong>{item.quantity}</strong>
                        </div>
                        <div className="stock-detail-card">
                            <span>Minimum Stok</span>
                            <strong>{item.minimumQuantity}</strong>
                        </div>
                    </div>

                </div>

                <div className="stock-detail-footer">
                    <button
                        type="button"
                        className="stock-detail-exit"
                        onClick={() => onRequestExit(item)}
                        disabled={Number(item.quantity) === 0}
                    >
                        <span className="material-symbols-outlined">remove</span>
                        Stok Çıkışı
                    </button>
                    <button type="button" className="stock-detail-entry" onClick={() => onRequestEntry(item)}>
                        <span className="material-symbols-outlined">add</span>
                        Stok Girişi
                    </button>
                </div>

            </div>
        </div>
    );
}

export default StockDetailModal;
