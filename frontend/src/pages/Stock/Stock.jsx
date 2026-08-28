import { useEffect, useMemo, useState } from "react";
import "./Stock.css";
import Layout from "../../components/Layout.jsx";
import StockMovementModal from "../../components/StockMovementModal.jsx";
import StockDetailModal from "../../components/StockDetailModal.jsx";
import {
    STOCK_STATUS,
    STOCK_STATUS_LABELS,
    getStockStatus,
    fetchStocks,
    createStock,
    increaseStock,
    decreaseStock
} from "./stockApi.js";

function Stock() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // { open, mode: "CREATE" | "INCREASE" | "DECREASE", item }
    const [movementModal, setMovementModal] = useState({ open: false, mode: "CREATE", item: null });

    const [detailItem, setDetailItem] = useState(null);

    const [successMessage, setSuccessMessage] = useState(null);

    // =====================================================
    // VERİ ÇEKME
    // =====================================================

    const loadItems = async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const data = await fetchStocks();
            setItems(data ?? []);
        } catch (error) {
            console.error("Stok verileri yüklenirken hata:", error);
            setLoadError(error.message || "Stok bilgileri yüklenemedi. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        if (!successMessage) {
            return;
        }
        const timer = setTimeout(() => setSuccessMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [successMessage]);

    // Detay modalı açıksa ve o ürün güncellendiyse, gösterilen veriyi de tazele.
    useEffect(() => {
        if (!detailItem) {
            return;
        }
        const updated = items.find((candidate) => candidate.id === detailItem.id);
        if (updated && updated !== detailItem) {
            setDetailItem(updated);
        }
    }, [items, detailItem]);

    // =====================================================
    // FİLTRELEME
    // =====================================================

    const filteredItems = useMemo(() => {
        const term = search.trim().toLowerCase();
        return items.filter((item) => {
            const matchesSearch = term === "" || item.productName.toLowerCase().includes(term);
            const matchesStatus = statusFilter === "ALL" || getStockStatus(item) === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [items, search, statusFilter]);

    const totalCount = items.length;
    const normalCount = items.filter((item) => getStockStatus(item) === STOCK_STATUS.NORMAL).length;
    const criticalCount = items.filter((item) => getStockStatus(item) === STOCK_STATUS.CRITICAL).length;
    const outOfStockCount = items.filter((item) => getStockStatus(item) === STOCK_STATUS.OUT_OF_STOCK).length;

    const attentionItems = items.filter((item) => getStockStatus(item) !== STOCK_STATUS.NORMAL);


    const openCreateModal = () => {
        setMovementModal({ open: true, mode: "CREATE", item: null });
    };

    const openIncreaseModal = (item) => {
        setMovementModal({ open: true, mode: "INCREASE", item });
    };

    const openDecreaseModal = (item) => {
        setMovementModal({ open: true, mode: "DECREASE", item });
    };

    const closeMovementModal = () => {
        setMovementModal({ open: false, mode: "CREATE", item: null });
    };

    const upsertItem = (updatedStock) => {
        setItems((prev) => {
            const exists = prev.some((candidate) => candidate.id === updatedStock.id);
            if (exists) {
                return prev.map((candidate) =>
                    candidate.id === updatedStock.id ? updatedStock : candidate
                );
            }
            return [...prev, updatedStock];
        });
    };

    const handleMovementSubmit = async (payload) => {
        if (movementModal.mode === "CREATE") {
            const created = await createStock(payload);
            upsertItem(created);
            setSuccessMessage(`${created.productName} stok listesine eklendi.`);
        } else if (movementModal.mode === "INCREASE") {
            const updated = await increaseStock(movementModal.item.id, payload.amount);
            upsertItem(updated);
            setSuccessMessage("Stok girişi kaydedildi.");
        } else {
            const updated = await decreaseStock(movementModal.item.id, payload.amount);
            upsertItem(updated);
            setSuccessMessage("Stok çıkışı kaydedildi.");
        }
        closeMovementModal();
    };

    // =====================================================
    // DETAY MODALI
    // =====================================================

    const openDetail = (item) => {
        setDetailItem(item);
    };

    const closeDetail = () => {
        setDetailItem(null);
    };

    const handleRequestEntryFromDetail = (item) => {
        closeDetail();
        openIncreaseModal(item);
    };

    const handleRequestExitFromDetail = (item) => {
        closeDetail();
        openDecreaseModal(item);
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
    };

    return (
        <Layout navbarType="dashboard" title="Stok Yönetimi">

            <div className="stock-page">

                <div className="stock-header">
                    <div>
                        <h1>Stok Yönetimi</h1>
                        <p>Ürün stoklarını takip edin ve envanter hareketlerini yönetin.</p>
                    </div>
                    <button className="new-stock-entry-button" onClick={openCreateModal}>
                        <span className="material-symbols-outlined">add</span>
                        Yeni Stok Kalemi
                    </button>
                </div>

                {successMessage && (
                    <div className="stock-success-banner">
                        <span className="material-symbols-outlined">check_circle</span>
                        {successMessage}
                    </div>
                )}

                <div className="stock-summary-grid">
                    <div className="stock-summary-card">
                        <div className="stock-summary-card-top">
                            <span>Toplam Ürün</span>
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                        <strong>{totalCount}</strong>
                    </div>
                    <div className="stock-summary-card">
                        <div className="stock-summary-card-top">
                            <span>Normal Stok</span>
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                        <strong>{normalCount}</strong>
                    </div>
                    <div className="stock-summary-card critical">
                        <div className="stock-summary-card-top">
                            <span>Kritik Stok</span>
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                        <strong>{criticalCount}</strong>
                    </div>
                    <div className="stock-summary-card out">
                        <div className="stock-summary-card-top">
                            <span>Stokta Yok</span>
                            <span className="material-symbols-outlined">error</span>
                        </div>
                        <strong>{outOfStockCount}</strong>
                    </div>
                </div>

                {attentionItems.length > 0 && (
                    <div className="stock-attention-card">
                        <div className="stock-attention-header">
                            <span className="material-symbols-outlined">warning</span>
                            <h2>Kritik Stoklar</h2>
                        </div>
                        <div className="stock-attention-list">
                            {attentionItems.map((item) => {
                                const status = getStockStatus(item);
                                return (
                                    <button
                                        type="button"
                                        className={`stock-attention-item ${status === STOCK_STATUS.OUT_OF_STOCK ? "out" : "critical"}`}
                                        key={item.id}
                                        onClick={() => openDetail(item)}
                                    >
                                        <span className="stock-attention-name">{item.productName}</span>
                                        <span className="stock-attention-ratio">
                                            {item.quantity} / {item.minimumQuantity}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="stock-panel">

                    <div className="stock-filters">

                        <div className="filter-field filter-search">
                            <label htmlFor="stock-search">Ürün Ara</label>
                            <div className="filter-search-input">
                                <span className="material-symbols-outlined">search</span>
                                <input
                                    id="stock-search"
                                    type="text"
                                    placeholder="Ürün adı ara..."
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="filter-field">
                            <label htmlFor="stock-status">Durum</label>
                            <select
                                id="stock-status"
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                            >
                                <option value="ALL">Tümü</option>
                                <option value={STOCK_STATUS.NORMAL}>Normal</option>
                                <option value={STOCK_STATUS.CRITICAL}>Kritik</option>
                                <option value={STOCK_STATUS.OUT_OF_STOCK}>Stokta Yok</option>
                            </select>
                        </div>

                        <button className="clear-button" onClick={handleClearFilters}>
                            Temizle
                        </button>

                    </div>

                    {loading ? (
                        <p className="stock-status-text">Yükleniyor...</p>
                    ) : loadError ? (
                        <p className="stock-status-text">{loadError}</p>
                    ) : (
                        <div className="stock-table-wrap">
                            <table className="stock-table">
                                <thead>
                                    <tr>
                                        <th>Ürün</th>
                                        <th className="text-right">Mevcut Stok</th>
                                        <th className="text-right">Minimum Stok</th>
                                        <th>Durum</th>
                                        <th className="text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((item) => {
                                        const status = getStockStatus(item);
                                        return (
                                            <tr key={item.id}>
                                                <td className="stock-product-name">{item.productName}</td>
                                                <td className="text-right stock-current">{item.quantity}</td>
                                                <td className="text-right stock-minimum">{item.minimumQuantity}</td>
                                                <td>
                                                    <span className={`stock-status-badge status-${status.toLowerCase()}`}>
                                                        <span className="dot"></span>
                                                        {STOCK_STATUS_LABELS[status]}
                                                    </span>
                                                </td>
                                                <td className="text-right">
                                                    <div className="stock-row-actions">
                                                        <button
                                                            className="action-button"
                                                            title="Stok Girişi"
                                                            onClick={() => openIncreaseModal(item)}
                                                        >
                                                            <span className="material-symbols-outlined">add_box</span>
                                                        </button>
                                                        <button
                                                            className="action-button"
                                                            title="Stok Çıkışı"
                                                            onClick={() => openDecreaseModal(item)}
                                                            disabled={Number(item.quantity) === 0}
                                                        >
                                                            <span className="material-symbols-outlined">indeterminate_check_box</span>
                                                        </button>
                                                        <button
                                                            className="action-button"
                                                            title="Detay"
                                                            onClick={() => openDetail(item)}
                                                        >
                                                            <span className="material-symbols-outlined">visibility</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {filteredItems.length === 0 && (
                                        <tr>
                                            <td className="stock-empty" colSpan={5}>
                                                Filtrelerinize uygun ürün bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>

            </div>

            <StockMovementModal
                open={movementModal.open}
                mode={movementModal.mode}
                item={movementModal.item}
                onCancel={closeMovementModal}
                onSubmit={handleMovementSubmit}
            />

            <StockDetailModal
                item={detailItem}
                status={detailItem ? getStockStatus(detailItem) : null}
                statusLabel={detailItem ? STOCK_STATUS_LABELS[getStockStatus(detailItem)] : null}
                onClose={closeDetail}
                onRequestEntry={handleRequestEntryFromDetail}
                onRequestExit={handleRequestExitFromDetail}
            />

        </Layout>
    );
}

export default Stock;
