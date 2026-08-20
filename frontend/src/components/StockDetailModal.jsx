import "./StockDetailModal.css";

function formatDateTime(isoString) {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
        return isoString;
    }
    return date.toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Tamamen sunum (presentational) bileşeni: veri çekme işini Stock.jsx yapar,
// bu component sadece kendisine verilen item/status/movements'ı gösterir.
//
// item: null ise kapalı, doluysa açık
// status: "NORMAL" | "CRITICAL" | "OUT_OF_STOCK"
// statusLabel: ekranda gösterilecek Türkçe metin
// movements: bu ürüne ait stok hareketleri listesi
// movementsLoading: hareketler yükleniyor mu
function StockDetailModal({ item, status, statusLabel, movements, movementsLoading, onClose, onRequestEntry, onRequestExit }) {

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
                        <p className="stock-detail-category">{item.category}</p>
                    </div>
                    <button type="button" className="stock-detail-close" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="stock-detail-body">

                    <div className="stock-detail-grid">
                        <div className="stock-detail-card highlight">
                            <span>Mevcut Stok</span>
                            <strong>{item.currentStock} <small>{item.unit}</small></strong>
                        </div>
                        <div className="stock-detail-card">
                            <span>Minimum Stok</span>
                            <strong>{item.minimumStock} <small>{item.unit}</small></strong>
                        </div>
                        <div className="stock-detail-card">
                            <span>Birim</span>
                            <strong>{item.unit}</strong>
                        </div>
                        <div className="stock-detail-card">
                            <span>Kategori</span>
                            <strong>{item.category}</strong>
                        </div>
                    </div>

                    <div className="stock-detail-history">
                        <h4>Son Stok Hareketleri</h4>

                        {movementsLoading ? (
                            <p className="stock-detail-empty">Yükleniyor...</p>
                        ) : movements.length === 0 ? (
                            <p className="stock-detail-empty">Bu ürün için henüz stok hareketi yok.</p>
                        ) : (
                            <div className="stock-detail-history-list">
                                {movements.map((movement) => (
                                    <div className="stock-detail-history-row" key={movement.id}>
                                        <span className="stock-detail-history-date">
                                            {formatDateTime(movement.date)}
                                        </span>
                                        <span className={`stock-detail-history-type ${movement.type === "IN" ? "in" : "out"}`}>
                                            <span className="dot"></span>
                                            {movement.type === "IN" ? "Stok Girişi" : "Stok Çıkışı"}
                                        </span>
                                        <span className={`stock-detail-history-quantity ${movement.type === "IN" ? "in" : "out"}`}>
                                            {movement.type === "IN" ? "+" : "-"}{movement.quantity} {item.unit}
                                        </span>
                                        <span className="stock-detail-history-note">{movement.note}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                <div className="stock-detail-footer">
                    <button type="button" className="stock-detail-exit" onClick={() => onRequestExit(item)}>
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
