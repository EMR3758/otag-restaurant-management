import { useEffect, useMemo, useState } from "react";
import "./Finance.css";
import Layout from "../../components/Layout.jsx";
import AddExpenseModal from "../../components/AddExpenseModal.jsx";
import DeleteConfirmModal from "../../components/DeleteConfirmModal.jsx";
import ExpenseEntryModal from "../../components/ExpenseEntryModal.jsx";
import {
    CHART_PERIODS,
    CHART_PERIOD_LABELS,
    FINANCE_PALETTE,
    getExpenseCategoryBreakdown,
    formatCurrency,
    formatDate,
    categoryLabel,
    paymentMethodLabel
} from "./financeMockData.js";
import {useRouteError} from "react-router-dom";

function authHeaders() {
    return {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
}
const PAYMENT_METHOD_TO_BACKEND = { kart: "CARD", nakit: "CASH", banka: "OTHER" };
const PAYMENT_METHOD_FROM_BACKEND = { CARD: "kart", CASH: "nakit", OTHER: "banka" };

function Finance() {

    const [overview, setOverview] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [chartPeriod, setChartPeriod] = useState(CHART_PERIODS.WEEKLY);
    const [chartData, setChartData] = useState(null);

    // { open, mode: "create" | "edit" | "view", expense }
    const [expenseModal, setExpenseModal] = useState({ open: false, mode: "create", expense: null });
    const [entryModalOpen, setEntryModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [successMessage, setSuccessMessage] = useState(null);

    // =====================================================
    // VERİ ÇEKME
    // =====================================================

    const loadOverview = async () => {
        const response = await fetch("http://localhost:8080/api/finance/overview", {
            headers: authHeaders()
        });
        if (!response.ok) {
            throw new Error("Finans özeti alınamadı.");
        }
        const backendOverview = await response.json();
        setOverview(backendOverview);
    };

    const loadExpenses = async () => {
        const response = await fetch("http://localhost:8080/api/expenses", {
            headers: authHeaders()
        });
        if (!response.ok) {
            throw new Error("Giderler alınamadı.");
        }
        const data = await response.json();


        const normalized = (data ?? []).map((expense) => ({
            ...expense,
            date: expense.date ? String(expense.date).slice(0, 10) : expense.date,
            paymentMethod: PAYMENT_METHOD_FROM_BACKEND[expense.paymentMethod] ?? expense.paymentMethod
        }));

        setExpenses(normalized);
    };

    useEffect(() => {
        setLoading(true);
        setLoadError(null);
        Promise.all([loadOverview(), loadExpenses()])
            .catch((error) => {
                console.error("Finans verileri yüklenirken hata:", error);
                setLoadError("Finans bilgileri yüklenemedi. Lütfen tekrar deneyin.");
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let cancelled = false;
        const loadChart = async () => {
            try{
                const response = await fetch(`http://localhost:8080/api/finance/chart?period=${chartPeriod}`,
                    {
                        headers:authHeaders()
                    });
                if (!response.ok){
                    throw new Error("Finans grafiği alınamadı.");
                }

                const data = await response.json();
                if(!cancelled){
                    setChartData(data);
                }
            }catch (error){
                console.error("Finans grafiği yüklenirken hata:",error);
                if(!cancelled){
                    setChartData({
                        labels:[],
                        income:[],
                        expense:[]
                    });
                }
            }
        };

        loadChart();

        return () => {
            cancelled=true;
        };
    }, [chartPeriod]);

    useEffect(() => {
        if (!successMessage) {
            return;
        }
        const timer = setTimeout(() => setSuccessMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [successMessage]);

    // =====================================================
    // TÜRETİLMİŞ DEĞERLER
    // =====================================================
    // dailyNet / monthlyNet / averageOrder ARTIK backend'den geliyor, frontend
    // bunları tekrar hesaplamıyor. Sadece Gider Dağılımı (kategori bazlı
    // toplam) için henüz backend endpoint'i olmadığından gerçek gider
    // listesinden frontend tarafında türetiliyor.

    const categoryBreakdown = useMemo(() => getExpenseCategoryBreakdown(expenses), [expenses]);

    const dailyRevenue = overview?.dailyRevenue ?? 0;
    const dailyExpenseTotal = overview?.dailyExpense ?? 0;
    const dailyNet = overview?.dailyNet ?? 0;
    const monthlyNet = overview?.monthlyNet ?? 0;
    const orderCount = overview?.orderCount ?? 0;
    const averageOrder = overview?.averageOrder ?? 0;

    const paymentMethodTotal = overview
        ? overview.paymentMethodBreakdown.reduce((sum, entry) => sum + entry.amount, 0)
        : 0;

    // =====================================================
    // GİDER EKLE / DÜZENLE / GÖRÜNTÜLE / SİL
    // =====================================================

    const openCreateModal = () => setExpenseModal({ open: true, mode: "create", expense: null });

    // ExpenseEntryModal ("+ Gider Ekle") akışı: OCR ile okunan/gözden geçirilen
    // kalemler onaylandığında çağrılır. Henüz kalıcı bir kayıt API'si bağlanmadı
    // (bkz. görev kapsamı) — bu adım sadece frontend akışını (yükle -> oku ->
    // göster -> düzenle) tamamlar, veritabanına yazma sonraki adımda eklenecek.
    const handleReceiptExpensesSaved = (reviewedExpenses) => {
        setSuccessMessage(
            `${reviewedExpenses.length} gider kalemi incelendi. Veritabanına kayıt özelliği bir sonraki adımda eklenecek.`
        );
    };
    const openViewModal = (expense) => setExpenseModal({ open: true, mode: "view", expense });
    const openEditModal = (expense) => setExpenseModal({ open: true, mode: "edit", expense });
    const closeExpenseModal = () => setExpenseModal({ open: false, mode: "create", expense: null });

    const handleExpenseSubmit = async (formValues) => {
        const isEditing = expenseModal.mode === "edit";

        const payload = {
            name: formValues.name.trim(),
            category: formValues.category,
            amount: Number(formValues.amount),
            // Backend PaymentMethod enum'u CARD/CASH/OTHER bekliyor (bkz. GEÇİCİ EŞLEME).
            paymentMethod: PAYMENT_METHOD_TO_BACKEND[formValues.paymentMethod] ?? formValues.paymentMethod,
            // Backend "date" alanı LocalDateTime — sade tarihe saat ekleniyor.
            date: `${formValues.date}T00:00:00`,
            description: formValues.description?.trim() ?? ""
        };

        const response = await fetch(
            isEditing
                ? `http://localhost:8080/api/expenses/${expenseModal.expense.id}`
                : "http://localhost:8080/api/expenses",
            {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            throw new Error(isEditing ? "Gider güncellenemedi." : "Gider eklenemedi.");
        }

        setSuccessMessage(isEditing ? "Gider başarıyla güncellendi." : "Gider başarıyla eklendi.");
        await loadExpenses();
        await loadOverview();
        closeExpenseModal();
    };

    const openDeleteConfirm = (expense) => setDeleteTarget(expense);
    const closeDeleteConfirm = () => setDeleteTarget(null);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) {
            return;
        }
        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/expenses/${deleteTarget.id}`, {
                method: "DELETE",
                headers: authHeaders()
            });
            if (!response.ok) {
                throw new Error("Gider silinemedi.");
            }
            await loadExpenses();
            await loadOverview();
            setSuccessMessage("Gider silindi.");
            setDeleteTarget(null);
        } catch (error) {
            console.error("Gider silinirken hata:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    // =====================================================
    // GRAFİK
    // =====================================================

    const chartMax = chartData
        ? Math.max(1, ...chartData.income, ...chartData.expense)
        : 1;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Layout navbarType="dashboard" title="Finans">

            <div className="finance-page">

                <div className="finance-header">
                    <div>
                        <h1>Finans</h1>
                        <p>Gelir, gider ve işletme finansal durumunu takip edin.</p>
                    </div>
                    <button className="finance-header-add-button" onClick={() => setEntryModalOpen(true)}>
                        <span className="material-symbols-outlined">add_circle</span>
                        GİDER EKLE
                    </button>
                </div>

                {successMessage && (
                    <div className="finance-success-banner">
                        <span className="material-symbols-outlined">check_circle</span>
                        {successMessage}
                    </div>
                )}

                {loading ? (
                    <p className="finance-status-text">Yükleniyor...</p>
                ) : loadError ? (
                    <p className="finance-status-text">{loadError}</p>
                ) : (
                    <>

                        {/* ÖZET KARTLAR */}
                        <div className="finance-summary-grid">

                            <div className="finance-summary-card">
                                <div className="finance-summary-top">
                                    <span>GÜNLÜK CİRO</span>
                                    <span className="material-symbols-outlined">trending_up</span>
                                </div>
                                <span className="finance-summary-value">{formatCurrency(dailyRevenue)}</span>
                                <span className="finance-summary-caption">Bugünkü toplam satış</span>
                            </div>

                            <div className="finance-summary-card">
                                <div className="finance-summary-top">
                                    <span>GÜNLÜK GİDER</span>
                                    <span className="material-symbols-outlined">trending_down</span>
                                </div>
                                <span className="finance-summary-value">{formatCurrency(dailyExpenseTotal)}</span>
                                <span className="finance-summary-caption">Bugünkü operasyonel gider</span>
                            </div>

                            <div className="finance-summary-card finance-summary-highlight">
                                <div className="finance-summary-top">
                                    <span>GÜNLÜK NET</span>
                                    <span className="material-symbols-outlined">account_balance_wallet</span>
                                </div>
                                <span className="finance-summary-value accent">{formatCurrency(dailyNet)}</span>
                                <span className="finance-summary-caption">Bugünkü net kâr</span>
                            </div>

                            <div className="finance-summary-card">
                                <div className="finance-summary-top">
                                    <span>AYLIK NET</span>
                                    <span className="material-symbols-outlined">insert_chart</span>
                                </div>
                                <span className="finance-summary-value">{formatCurrency(monthlyNet)}</span>
                                <span className="finance-summary-caption">Bu ayki toplam net kâr</span>
                            </div>

                        </div>

                        {/* ANA GRID */}
                        <div className="finance-main-grid">

                            {/* SOL KOLON */}
                            <div className="finance-col-wide">

                                {/* GRAFİK */}
                                <section className="finance-card">

                                    <div className="finance-card-header">
                                        <h3>Gelir / Gider Analizi</h3>
                                        <div className="finance-chart-filters">
                                            {Object.values(CHART_PERIODS).map((period) => (
                                                <button
                                                    key={period}
                                                    className={`finance-chart-filter-chip ${chartPeriod === period ? "active" : ""}`}
                                                    onClick={() => setChartPeriod(period)}
                                                >
                                                    {CHART_PERIOD_LABELS[period]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="finance-chart-legend">
                                        <span className="finance-chart-legend-item">
                                            <span className="dot income"></span> Gelir
                                        </span>
                                        <span className="finance-chart-legend-item">
                                            <span className="dot expense"></span> Gider
                                        </span>
                                    </div>

                                    <div className="finance-chart">
                                        {chartData && chartData.labels.map((label, index) => {
                                            const incomeValue = chartData.income[index];
                                            const expenseValue = chartData.expense[index];
                                            return (
                                                <div className="finance-chart-group" key={label}>
                                                    <div className="finance-chart-bars">
                                                        <div
                                                            className="finance-chart-bar income"
                                                            style={{ height: `${(incomeValue / chartMax) * 100}%` }}
                                                            title={`Gelir: ${formatCurrency(incomeValue)}`}
                                                        ></div>
                                                        <div
                                                            className="finance-chart-bar expense"
                                                            style={{ height: `${(expenseValue / chartMax) * 100}%` }}
                                                            title={`Gider: ${formatCurrency(expenseValue)}`}
                                                        ></div>
                                                    </div>
                                                    <span className="finance-chart-label">{label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                </section>

                                {/* GİDERLER TABLOSU */}
                                <section className="finance-card finance-table-card">

                                    <div className="finance-card-header">
                                        <h3>Giderler</h3>
                                        <button className="finance-add-expense-button" onClick={openCreateModal}>
                                            <span className="material-symbols-outlined">add</span>
                                            GİDER EKLE
                                        </button>
                                    </div>

                                    <div className="finance-table-wrap">
                                        <table className="finance-table">
                                            <thead>
                                                <tr>
                                                    <th>Tarih</th>
                                                    <th>Gider</th>
                                                    <th>Kategori</th>
                                                    <th>Ödeme Yöntemi</th>
                                                    <th className="text-right">Tutar</th>
                                                    <th>Açıklama</th>
                                                    <th className="text-center">İşlemler</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {expenses.map((expense) => (
                                                    <tr key={expense.id}>
                                                        <td>{formatDate(expense.date)}</td>
                                                        <td className="finance-expense-name">{expense.name}</td>
                                                        <td>
                                                            <span className="finance-category-cell">
                                                                <span className="dot"></span>
                                                                {categoryLabel(expense.category)}
                                                            </span>
                                                        </td>
                                                        <td className="finance-secondary-cell">
                                                            {paymentMethodLabel(expense.paymentMethod)}
                                                        </td>
                                                        <td className="text-right finance-amount-cell">
                                                            {formatCurrency(expense.amount)}
                                                        </td>
                                                        <td className="finance-description-cell" title={expense.description}>
                                                            {expense.description || "—"}
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="finance-row-actions">
                                                                <button
                                                                    className="finance-action-button"
                                                                    title="Görüntüle"
                                                                    onClick={() => openViewModal(expense)}
                                                                >
                                                                    <span className="material-symbols-outlined">visibility</span>
                                                                </button>
                                                                <button
                                                                    className="finance-action-button"
                                                                    title="Düzenle"
                                                                    onClick={() => openEditModal(expense)}
                                                                >
                                                                    <span className="material-symbols-outlined">edit</span>
                                                                </button>
                                                                <button
                                                                    className="finance-action-button danger"
                                                                    title="Sil"
                                                                    onClick={() => openDeleteConfirm(expense)}
                                                                >
                                                                    <span className="material-symbols-outlined">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {expenses.length === 0 && (
                                                    <tr>
                                                        <td className="finance-empty" colSpan={7}>
                                                            Henüz gider kaydı bulunmuyor.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                </section>

                            </div>

                            {/* SAĞ KOLON */}
                            <div className="finance-col-narrow">

                                {/* BUGÜN ÖZETİ */}
                                <section className="finance-card">
                                    <h4 className="finance-widget-title">BUGÜN</h4>
                                    <div className="finance-widget-rows">
                                        <div className="finance-widget-row">
                                            <span>Toplam Ciro</span>
                                            <strong>{formatCurrency(dailyRevenue)}</strong>
                                        </div>
                                        <div className="finance-widget-row">
                                            <span>Sipariş Sayısı</span>
                                            <strong>{orderCount}</strong>
                                        </div>
                                        <div className="finance-widget-row">
                                            <span>Ortalama Sipariş</span>
                                            <strong>{formatCurrency(averageOrder)}</strong>
                                        </div>
                                    </div>
                                </section>

                                {/* ÖDEME YÖNTEMLERİ */}
                                <section className="finance-card">
                                    <h4 className="finance-widget-title">ÖDEME YÖNTEMLERİ</h4>
                                    <div className="finance-payment-methods">
                                        {overview?.paymentMethodBreakdown.map((entry) => {
                                            const percent = paymentMethodTotal > 0
                                                ? Math.round((entry.amount / paymentMethodTotal) * 100)
                                                : 0;
                                            return (
                                                <div className="finance-payment-method" key={entry.method}>
                                                    <div className="finance-payment-method-row">
                                                        <span className="finance-payment-method-label">
                                                            <span className="material-symbols-outlined">{entry.icon}</span>
                                                            {entry.label}
                                                        </span>
                                                        <span>{formatCurrency(entry.amount)}</span>
                                                    </div>
                                                    <div className="finance-progress-track">
                                                        <div
                                                            className={`finance-progress-fill ${entry.method}`}
                                                            style={{ width: `${percent}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* GİDER DAĞILIMI */}
                                <section className="finance-card">
                                    <h4 className="finance-widget-title">GİDER DAĞILIMI</h4>
                                    <ul className="finance-distribution-list">
                                        {categoryBreakdown.map((entry, index) => (
                                            <li key={entry.category}>
                                                <span className="finance-distribution-label">
                                                    <span
                                                        className="dot"
                                                        style={{ background: FINANCE_PALETTE[index % FINANCE_PALETTE.length] }}
                                                    ></span>
                                                    {entry.label}
                                                </span>
                                                <span className="finance-distribution-value">
                                                    {formatCurrency(entry.amount)}
                                                </span>
                                            </li>
                                        ))}

                                        {categoryBreakdown.length === 0 && (
                                            <li className="finance-distribution-empty">
                                                Bu ay için gider kaydı yok.
                                            </li>
                                        )}
                                    </ul>
                                </section>

                                {/* NET GELİR AÇIKLAMASI */}
                                <section className="finance-formula-card">
                                    <span className="material-symbols-outlined">calculate</span>
                                    <p>Net Gelir = Toplam Gelir - Toplam Gider</p>
                                </section>

                            </div>

                        </div>

                    </>
                )}

            </div>

            <ExpenseEntryModal
                open={entryModalOpen}
                onClose={() => setEntryModalOpen(false)}
                onManualAdd={() => {
                    setEntryModalOpen(false);
                    openCreateModal();
                }}
                onSaved={handleReceiptExpensesSaved}
            />

            <AddExpenseModal
                open={expenseModal.open}
                mode={expenseModal.mode}
                expense={expenseModal.expense}
                onCancel={closeExpenseModal}
                onSubmit={handleExpenseSubmit}
            />

            <DeleteConfirmModal
                open={!!deleteTarget}
                title="Gideri Sil"
                message={deleteTarget ? `"${deleteTarget.name}" giderini silmek istediğinize emin misiniz?` : ""}
                confirmLabel="Sil"
                cancelLabel="Vazgeç"
                isConfirming={isDeleting}
                onConfirm={handleDeleteConfirm}
                onCancel={closeDeleteConfirm}
            />

        </Layout>
    );

}

export default Finance;
