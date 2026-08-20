import { useEffect, useState } from "react";
import "./Reservation.css";
import Layout from "../../components/Layout.jsx";
import ReservationModal from "../../components/ReservationModal.jsx";
import DeleteConfirmModal from "../../components/DeleteConfirmModal.jsx";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "ARRIVED", "COMPLETED", "CANCELLED", "NO_SHOW"];

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

function formatDateLabel(dateStr) {
    if (!dateStr) {
        return "";
    }
    const date = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        return dateStr;
    }
    return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTimeLabel(timeStr) {
    return (timeStr ?? "").slice(0, 5);
}

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
});

async function parseErrorMessage(response, fallback) {
    try {
        const body = await response.json();
        return body?.message || fallback;
    } catch {
        return fallback;
    }
}

function Reservation() {

    const [tables, setTables] = useState([]);

    // Özet kartlar için: tarih filtresinden bağımsız, TÜM rezervasyonlar.
    const [allReservations, setAllReservations] = useState([]);
    // Tabloda gösterilen liste: tarih filtresi varsa backend'den o güne
    // özel çekilir (GET /reservations/date/{date}), yoksa tüm liste.
    const [listReservations, setListReservations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [dateFilter, setDateFilter] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingReservation, setEditingReservation] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [statusUpdatingId, setStatusUpdatingId] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // =====================================================
    // VERİ ÇEKME
    // =====================================================

    const fetchTables = async () => {
        const response = await fetch("http://localhost:8080/tables", { headers: authHeaders() });
        if (!response.ok) {
            throw new Error("Masalar alınamadı");
        }
        return response.json();
    };

    const fetchAllReservations = async () => {
        const response = await fetch("http://localhost:8080/reservations", { headers: authHeaders() });
        if (!response.ok) {
            throw new Error("Rezervasyonlar alınamadı");
        }
        return response.json();
    };

    const fetchReservationsByDate = async (date) => {
        const response = await fetch(`http://localhost:8080/reservations/date/${date}`, { headers: authHeaders() });
        if (!response.ok) {
            throw new Error("Rezervasyonlar alınamadı");
        }
        return response.json();
    };

    const loadAll = async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const [tablesData, allData] = await Promise.all([fetchTables(), fetchAllReservations()]);
            setTables(tablesData ?? []);
            setAllReservations(allData ?? []);
            setListReservations(allData ?? []);
        } catch (error) {
            console.error("Rezervasyon verileri yüklenirken hata:", error);
            setLoadError("Rezervasyon bilgileri yüklenemedi. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    // Tarih filtresi değiştiğinde tablo verisini backend'den o güne
    // özel yeniden çeker (özet kartlar allReservations'tan bağımsız kalır).
    useEffect(() => {
        if (!dateFilter) {
            setListReservations(allReservations);
            return;
        }
        let cancelled = false;
        fetchReservationsByDate(dateFilter)
            .then((data) => {
                if (!cancelled) {
                    setListReservations(data ?? []);
                }
            })
            .catch((error) => {
                console.error("Tarihe göre rezervasyon alınırken hata:", error);
                if (!cancelled) {
                    setListReservations([]);
                }
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateFilter, allReservations]);

    const refreshAfterMutation = async () => {
        try {
            const allData = await fetchAllReservations();
            setAllReservations(allData ?? []);
            if (!dateFilter) {
                setListReservations(allData ?? []);
            } else {
                const dateData = await fetchReservationsByDate(dateFilter);
                setListReservations(dateData ?? []);
            }
        } catch (error) {
            console.error("Rezervasyon listesi yenilenirken hata:", error);
        }
    };

    useEffect(() => {
        if (!successMessage) {
            return;
        }
        const timer = setTimeout(() => setSuccessMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [successMessage]);

    // =====================================================
    // FİLTRELEME (arama + durum, client-side)
    // =====================================================

    const filteredReservations = listReservations.filter((reservation) => {
        const term = search.trim().toLowerCase();
        const matchesSearch =
            term === "" ||
            reservation.customerName?.toLowerCase().includes(term) ||
            reservation.customerPhone?.toLowerCase().includes(term) ||
            reservation.table?.tableNumber?.toLowerCase().includes(term);

        const matchesStatus = statusFilter === "ALL" || reservation.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // =====================================================
    // ÖZET KARTLAR (gerçek veriden hesaplanır)
    // =====================================================

    const todayStr = toInputDateValue(new Date());
    const todayCount = allReservations.filter((r) => r.reservationDate === todayStr).length;
    const pendingCount = allReservations.filter((r) => r.status === "PENDING").length;
    const confirmedCount = allReservations.filter((r) => r.status === "CONFIRMED").length;
    const completedCount = allReservations.filter((r) => r.status === "COMPLETED").length;
    const cancelledCount = allReservations.filter((r) => r.status === "CANCELLED" || r.status === "NO_SHOW").length;

    // =====================================================
    // CRUD AKSİYONLARI
    // =====================================================

    const openCreateModal = () => {
        setModalMode("create");
        setEditingReservation(null);
        setIsModalOpen(true);
    };

    const openEditModal = (reservation) => {
        setModalMode("edit");
        setEditingReservation(reservation);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (payload) => {
        const isEdit = modalMode === "edit" && editingReservation;
        const url = isEdit
            ? `http://localhost:8080/reservations/${editingReservation.id}`
            : "http://localhost:8080/reservations";

        const response = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders()
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const message = await parseErrorMessage(
                response,
                isEdit ? "Rezervasyon güncellenemedi." : "Rezervasyon oluşturulamadı."
            );
            throw new Error(message);
        }

        setIsModalOpen(false);
        setEditingReservation(null);
        setSuccessMessage(isEdit ? "Rezervasyon güncellendi." : "Rezervasyon oluşturuldu.");
        await refreshAfterMutation();
    };

    const handleStatusChange = async (reservation, newStatus) => {
        if (newStatus === reservation.status || statusUpdatingId === reservation.id) {
            return;
        }
        setStatusUpdatingId(reservation.id);
        try {
            const response = await fetch(`http://localhost:8080/reservations/${reservation.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) {
                const message = await parseErrorMessage(response, "Durum güncellenemedi.");
                throw new Error(message);
            }
            setSuccessMessage("Rezervasyon durumu güncellendi.");
            await refreshAfterMutation();
        } catch (error) {
            console.error("Durum güncellenirken hata:", error);
            alert(error.message || "Durum güncellenirken bir hata oluştu.");
        } finally {
            setStatusUpdatingId(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) {
            return;
        }
        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:8080/reservations/${deleteTarget.id}`, {
                method: "DELETE",
                headers: authHeaders()
            });
            if (!response.ok) {
                const message = await parseErrorMessage(response, "Rezervasyon silinemedi.");
                throw new Error(message);
            }
            setSuccessMessage("Rezervasyon silindi.");
            setDeleteTarget(null);
            await refreshAfterMutation();
        } catch (error) {
            console.error("Rezervasyon silinirken hata:", error);
            alert(error.message || "Rezervasyon silinirken bir hata oluştu.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setDateFilter("");
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Layout navbarType="dashboard" title="Rezervasyonlar">

            <div className="reservations-page">

                <div className="reservations-header">
                    <div>
                        <h1>Rezervasyonlar</h1>
                        <p>Rezervasyonlarınızı ve masa planlamanızı yönetin.</p>
                    </div>
                    <button className="new-reservation-button" onClick={openCreateModal}>
                        <span className="material-symbols-outlined">add</span>
                        Yeni Rezervasyon
                    </button>
                </div>

                {successMessage && (
                    <div className="reservations-success-banner">
                        <span className="material-symbols-outlined">check_circle</span>
                        {successMessage}
                    </div>
                )}

                <div className="reservations-summary-grid">
                    <div className="reservation-summary-card">
                        <div className="reservation-summary-card-top">
                            <span>Bugünkü</span>
                            <span className="material-symbols-outlined">today</span>
                        </div>
                        <strong>{todayCount}</strong>
                    </div>
                    <div className="reservation-summary-card">
                        <div className="reservation-summary-card-top">
                            <span>Bekleyen</span>
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                        <strong>{pendingCount}</strong>
                    </div>
                    <div className="reservation-summary-card">
                        <div className="reservation-summary-card-top">
                            <span>Onaylanan</span>
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                        <strong>{confirmedCount}</strong>
                    </div>
                    <div className="reservation-summary-card">
                        <div className="reservation-summary-card-top">
                            <span>Tamamlanan</span>
                            <span className="material-symbols-outlined">task_alt</span>
                        </div>
                        <strong>{completedCount}</strong>
                    </div>
                    <div className="reservation-summary-card">
                        <div className="reservation-summary-card-top">
                            <span>İptal / Gelmedi</span>
                            <span className="material-symbols-outlined">cancel</span>
                        </div>
                        <strong>{cancelledCount}</strong>
                    </div>
                </div>

                <div className="reservations-panel">

                    <div className="reservations-filters">

                        <div className="filter-field filter-search">
                            <label htmlFor="reservation-search">Arama</label>
                            <div className="filter-search-input">
                                <span className="material-symbols-outlined">search</span>
                                <input
                                    id="reservation-search"
                                    type="text"
                                    placeholder="Müşteri, telefon veya masa ara..."
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="filter-field">
                            <label htmlFor="reservation-date">Tarih</label>
                            <input
                                id="reservation-date"
                                type="date"
                                value={dateFilter}
                                onChange={(event) => setDateFilter(event.target.value)}
                            />
                        </div>

                        <div className="filter-field">
                            <label htmlFor="reservation-status">Durum</label>
                            <select
                                id="reservation-status"
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                            >
                                <option value="ALL">Tüm Durumlar</option>
                                {STATUS_OPTIONS.map((status) => (
                                    <option value={status} key={status}>
                                        {STATUS_LABELS[status]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button className="clear-button" onClick={handleClearFilters}>
                            Temizle
                        </button>

                    </div>

                    {loading ? (
                        <p className="reservations-status-text">Yükleniyor...</p>
                    ) : loadError ? (
                        <p className="reservations-status-text">{loadError}</p>
                    ) : (
                        <div className="reservations-table-wrap">
                            <table className="reservations-table">
                                <thead>
                                    <tr>
                                        <th>Müşteri</th>
                                        <th>Telefon</th>
                                        <th>Tarih</th>
                                        <th>Saat</th>
                                        <th className="text-center">Kişi</th>
                                        <th>Masa</th>
                                        <th>Durum</th>
                                        <th className="text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReservations.map((reservation) => (
                                        <tr key={reservation.id}>
                                            <td className="reservation-customer">
                                                {reservation.customerName}
                                                {reservation.note && (
                                                    <span className="reservation-note" title={reservation.note}>
                                                        {reservation.note}
                                                    </span>
                                                )}
                                            </td>
                                            <td>{reservation.customerPhone}</td>
                                            <td>{formatDateLabel(reservation.reservationDate)}</td>
                                            <td>{formatTimeLabel(reservation.reservationTime)}</td>
                                            <td className="text-center">{reservation.guestCount}</td>
                                            <td>{reservation.table ? `Masa ${reservation.table.tableNumber}` : "—"}</td>
                                            <td>
                                                <select
                                                    className={`reservation-status-select status-${reservation.status?.toLowerCase()}`}
                                                    value={reservation.status}
                                                    onChange={(event) => handleStatusChange(reservation, event.target.value)}
                                                    disabled={statusUpdatingId === reservation.id}
                                                >
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <option value={status} key={status}>
                                                            {STATUS_LABELS[status]}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="text-right">
                                                <div className="reservation-actions">
                                                    <button
                                                        className="action-button"
                                                        title="Düzenle"
                                                        onClick={() => openEditModal(reservation)}
                                                    >
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>
                                                    <button
                                                        className="action-button action-button-delete"
                                                        title="Sil"
                                                        onClick={() => setDeleteTarget(reservation)}
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredReservations.length === 0 && (
                                        <tr>
                                            <td className="reservations-empty" colSpan={8}>
                                                Filtrelerinize uygun rezervasyon bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>

            </div>

            <ReservationModal
                open={isModalOpen}
                mode={modalMode}
                initialData={editingReservation}
                tables={tables}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingReservation(null);
                }}
                onSubmit={handleModalSubmit}
            />

            <DeleteConfirmModal
                open={!!deleteTarget}
                title="Rezervasyonu Sil?"
                message={
                    deleteTarget
                        ? `${deleteTarget.customerName} adına oluşturulan rezervasyon silinsin mi? Bu işlem geri alınamaz.`
                        : ""
                }
                confirmLabel="Rezervasyonu Sil"
                isConfirming={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />

        </Layout>
    );
}

export default Reservation;
