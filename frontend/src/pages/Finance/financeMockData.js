// =============================================================
// FİNANS MOCK VERİSİ + "API" KATMANI
// =============================================================
//
// Henüz backend yok. Bu dosya, gerçek bir REST API varmış gibi
// davranan fonksiyonlar (hepsi Promise döner) ve mock veriyi tek
// yerde tutar. Finance.jsx ve AddExpenseModal bu fonksiyonları
// çağırır, mock veriye veya iç yapıya asla doğrudan erişmez.
//
// GERÇEK BACKEND GELDİĞİNDE: sadece bu dosyadaki fonksiyonların
// GÖVDESİNİ, "http://localhost:8080/finance/..." vb. gerçek fetch
// çağrılarıyla değiştirmeniz yeterli — Finance.jsx ve modalde
// hiçbir değişiklik gerekmez. Örnek:
//
//   export function fetchExpenses() {
//       return fetch("http://localhost:8080/expenses", { headers: authHeaders() })
//           .then((res) => res.json());
//   }
//
// =============================================================

// -------------------------------------------------------------
// TİP TANIMI (JSDoc) — proje TypeScript olmadığı için Expense
// modelini burada belgeliyoruz. Backend Entity/DTO DEĞİLDİR,
// sadece frontend tarafında şekli netleştirmek içindir.
//
// @typedef {Object} Expense
// @property {number} id
// @property {string} date            ISO tarih, "YYYY-MM-DD"
// @property {string} name            Gider adı
// @property {string} category        EXPENSE_CATEGORIES value'lerinden biri
// @property {number} amount          TL tutar
// @property {string} paymentMethod   PAYMENT_METHODS value'lerinden biri
// @property {string} description     Serbest metin açıklama
// -------------------------------------------------------------

export const EXPENSE_CATEGORIES = [
    { value: "kira", label: "Kira" },
    { value: "elektrik", label: "Elektrik" },
    { value: "su", label: "Su" },
    { value: "dogalgaz", label: "Doğalgaz" },
    { value: "personel", label: "Personel" },
    { value: "malzeme", label: "Malzeme" },
    { value: "tedarikci", label: "Tedarikçi" },
    { value: "bakim", label: "Bakım" },
    { value: "vergi", label: "Vergi" },
    { value: "diger", label: "Diğer" }
];

export const PAYMENT_METHODS = [
    { value: "banka", label: "Banka Transferi" },
    { value: "kart", label: "Kredi Kartı" },
    { value: "nakit", label: "Nakit" }
];

export const CHART_PERIODS = {
    DAILY: "DAILY",
    WEEKLY: "WEEKLY",
    MONTHLY: "MONTHLY",
    YEARLY: "YEARLY"
};

export const CHART_PERIOD_LABELS = {
    [CHART_PERIODS.DAILY]: "Günlük",
    [CHART_PERIODS.WEEKLY]: "Haftalık",
    [CHART_PERIODS.MONTHLY]: "Bu Ay",
    [CHART_PERIODS.YEARLY]: "Bu Yıl"
};

// Gider dağılımı / grafik noktalarında kullanılan sabit renk paleti
// (OTAĞ paletine uygun — primary + tonları).
export const FINANCE_PALETTE = ["#9e3d00", "#a23f00", "#5e5c56", "#8c7166", "#5f5e5e"];

function categoryLabel(value) {
    return EXPENSE_CATEGORIES.find((category) => category.value === value)?.label ?? value;
}

function paymentMethodLabel(value) {
    return PAYMENT_METHODS.find((method) => method.value === value)?.label ?? value;
}

// -------------------------------------------------------------
// "BUGÜN" — mock veri seti bugüne göre kurgulandı ki günlük
// kartlar/gider tablosu tutarlı görünsün. Gerçek backend
// geldiğinde bu sabite ihtiyaç kalmaz (backend "today" tarihine
// göre zaten filtrelenmiş toplamlar döner).
// -------------------------------------------------------------

const TODAY = "2026-08-20";

function todayStr() {
    return TODAY;
}

function isSameMonth(dateStr, referenceDateStr) {
    return dateStr.slice(0, 7) === referenceDateStr.slice(0, 7);
}

// -------------------------------------------------------------
// GELİR TARAFI (mock, şimdilik sabit — sipariş/gelir modülü bu
// görevin kapsamı dışında). Gider CRUD'undan ETKİLENMEZ.
// -------------------------------------------------------------

let incomeOverview = {
    dailyRevenue: 18450,
    orderCount: 42,
    monthlyRevenue: 328000,
    paymentMethodBreakdown: [
        { method: "kart", label: "KART", amount: 11250, icon: "credit_card" },
        { method: "nakit", label: "NAKİT", amount: 5700, icon: "payments" },
        { method: "diger", label: "DİĞER", amount: 1500, icon: "devices" }
    ]
};

// -------------------------------------------------------------
// GİDER KAYITLARI (mock, modül seviyesinde tutuluyor ki Gider
// Ekle/Düzenle/Sil işlemleri sayfalar arası geçişte kalıcı olsun).
// Günlük/aylık gider, kategori dağılımı ve net kâr HEP bu diziden
// TÜRETİLİR — ekranda ayrı sabit sayı yoktur.
// -------------------------------------------------------------

let expenses = [
    { id: 1, date: "2026-08-20", name: "Elektrik Faturası", category: "elektrik", amount: 1450, paymentMethod: "banka", description: "Ağustos ayı elektrik faturası." },
    { id: 2, date: "2026-08-20", name: "Kahve Çekirdeği Alımı", category: "malzeme", amount: 1800, paymentMethod: "kart", description: "10 kg Arabica çekirdek." },
    { id: 3, date: "2026-08-19", name: "Su Faturası", category: "su", amount: 1200, paymentMethod: "nakit", description: "Temmuz-Ağustos dönemi." },
    { id: 4, date: "2026-08-18", name: "Personel Maaş Avansı", category: "personel", amount: 6000, paymentMethod: "banka", description: "Mutfak ekibi avans ödemesi." },
    { id: 5, date: "2026-08-17", name: "Nargile Tütünü Tedariki", category: "tedarikci", amount: 2650, paymentMethod: "kart", description: "Aylık nargile tütünü siparişi." },
    { id: 6, date: "2026-08-15", name: "Dükkan Kirası", category: "kira", amount: 7000, paymentMethod: "banka", description: "Ağustos ayı kira ödemesi." },
    { id: 7, date: "2026-08-14", name: "Doğalgaz Faturası", category: "dogalgaz", amount: 980, paymentMethod: "banka", description: "Ağustos ayı doğalgaz faturası." },
    { id: 8, date: "2026-08-12", name: "Mutfak Ekipman Bakımı", category: "bakim", amount: 1450, paymentMethod: "kart", description: "Bulaşık makinesi periyodik bakımı." },
    { id: 9, date: "2026-08-10", name: "Personel Maaş Ödemesi", category: "personel", amount: 12000, paymentMethod: "banka", description: "Ağustos ayı personel maaşları." },
    { id: 10, date: "2026-08-09", name: "KDV Beyannamesi Ödemesi", category: "vergi", amount: 3400, paymentMethod: "banka", description: "Ağustos dönemi vergi ödemesi." },
    { id: 11, date: "2026-08-07", name: "Süt ve Süt Ürünleri", category: "malzeme", amount: 2100, paymentMethod: "nakit", description: "Haftalık süt ürünleri alımı." },
    { id: 12, date: "2026-08-05", name: "Temizlik Malzemeleri", category: "diger", amount: 640, paymentMethod: "nakit", description: "Genel temizlik malzemesi alımı." },
    { id: 13, date: "2026-08-03", name: "İnternet ve Telefon", category: "diger", amount: 550, paymentMethod: "kart", description: "Aylık sabit hat faturası." },
    { id: 14, date: "2026-07-28", name: "Kira - Temmuz", category: "kira", amount: 7000, paymentMethod: "banka", description: "Temmuz ayı kira ödemesi." }
];

let nextExpenseId = 15;

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

// -------------------------------------------------------------
// GRAFİK VERİSİ (mock, dönem bazlı hazır seri). Gerçek backend
// geldiğinde bu, dönem parametresiyle çağrılan tek bir "finance
// analytics" endpoint'ine dönüşebilir.
// -------------------------------------------------------------

const chartDataByPeriod = {
    [CHART_PERIODS.DAILY]: {
        labels: ["09:00", "12:00", "15:00", "18:00", "21:00"],
        income: [1200, 4800, 3600, 5200, 3650],
        expense: [400, 900, 650, 850, 450]
    },
    [CHART_PERIODS.WEEKLY]: {
        labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
        income: [15000, 18450, 14200, 16800, 22000, 28000, 26000],
        expense: [4200, 3250, 5100, 3800, 6200, 7500, 6800]
    },
    [CHART_PERIODS.MONTHLY]: {
        labels: ["Hafta 1", "Hafta 2", "Hafta 3", "Hafta 4"],
        income: [78000, 84000, 80000, 86000],
        expense: [9800, 10500, 9200, 11720]
    },
    [CHART_PERIODS.YEARLY]: {
        labels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
        income: [265000, 278000, 290000, 305000, 312000, 330000, 345000, 328000, 300000, 285000, 270000, 310000],
        expense: [38000, 39500, 40200, 42000, 43500, 45800, 48200, 41220, 40500, 39800, 38500, 44000]
    }
};

// =============================================================
// SAF HESAPLAMA / SEÇİCİ FONKSİYONLAR (senkron, Promise DEĞİL)
// =============================================================
// Bunlar backend'e taşınmaz; sayfa gerçek API'den ham "expenses"
// listesini çektikten sonra da aynı fonksiyonlarla türetilmiş
// değerleri (günlük/aylık gider, dağılım, net) hesaplamaya devam
// edebilir.

export function getDailyExpenseTotal(expenseList, dateStr = todayStr()) {
    return expenseList
        .filter((expense) => expense.date === dateStr)
        .reduce((sum, expense) => sum + expense.amount, 0);
}

export function getMonthlyExpenseTotal(expenseList, referenceDateStr = todayStr()) {
    return expenseList
        .filter((expense) => isSameMonth(expense.date, referenceDateStr))
        .reduce((sum, expense) => sum + expense.amount, 0);
}

// İlk `topN` kategoriyi tutar, kalanını "Diğer" altında toplar.
export function getExpenseCategoryBreakdown(expenseList, referenceDateStr = todayStr(), topN = 4) {
    const totals = {};

    expenseList
        .filter((expense) => isSameMonth(expense.date, referenceDateStr))
        .forEach((expense) => {
            totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
        });

    const sorted = Object.entries(totals)
        .map(([category, amount]) => ({ category, label: categoryLabel(category), amount }))
        .sort((a, b) => b.amount - a.amount);

    const top = sorted.slice(0, topN);
    const rest = sorted.slice(topN);
    const restTotal = rest.reduce((sum, entry) => sum + entry.amount, 0);

    return restTotal > 0
        ? [...top, { category: "diger-toplam", label: "Diğer", amount: restTotal }]
        : top;
}

export function calculateDailyNet(dailyRevenue, dailyExpenseTotal) {
    return dailyRevenue - dailyExpenseTotal;
}

export function calculateMonthlyNet(monthlyRevenue, monthlyExpenseTotal) {
    return monthlyRevenue - monthlyExpenseTotal;
}

export function calculateAverageOrder(dailyRevenue, orderCount) {
    if (!orderCount) {
        return 0;
    }
    return Math.round(dailyRevenue / orderCount);
}

export function formatCurrency(amount) {
    return `₺${Math.round(amount).toLocaleString("tr-TR")}`;
}

export function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
}

// =============================================================
// "API" FONKSİYONLARI (şimdilik mock, imzaları backend'e hazır)
// =============================================================

export function fetchFinanceOverview() {
    return Promise.resolve(clone(incomeOverview));
}

export function fetchExpenses() {
    return Promise.resolve(
        clone(expenses).sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    );
}

export function fetchChartData(period) {
    return Promise.resolve(clone(chartDataByPeriod[period] ?? chartDataByPeriod[CHART_PERIODS.WEEKLY]));
}

export function addExpense(input) {
    const errors = validateExpenseInput(input);
    if (errors.length > 0) {
        return Promise.reject(new Error(errors[0]));
    }

    const expense = {
        id: nextExpenseId++,
        date: input.date,
        name: input.name.trim(),
        category: input.category,
        amount: Number(input.amount),
        paymentMethod: input.paymentMethod,
        description: input.description?.trim() ?? ""
    };

    expenses = [expense, ...expenses];

    return Promise.resolve(clone(expense));
}

export function updateExpense(id, input) {
    const errors = validateExpenseInput(input);
    if (errors.length > 0) {
        return Promise.reject(new Error(errors[0]));
    }

    const existing = expenses.find((expense) => expense.id === id);
    if (!existing) {
        return Promise.reject(new Error("Gider kaydı bulunamadı."));
    }

    Object.assign(existing, {
        date: input.date,
        name: input.name.trim(),
        category: input.category,
        amount: Number(input.amount),
        paymentMethod: input.paymentMethod,
        description: input.description?.trim() ?? ""
    });

    return Promise.resolve(clone(existing));
}

export function deleteExpense(id) {
    const existed = expenses.some((expense) => expense.id === id);
    if (!existed) {
        return Promise.reject(new Error("Gider kaydı bulunamadı."));
    }

    expenses = expenses.filter((expense) => expense.id !== id);

    return Promise.resolve({ id });
}

// -------------------------------------------------------------
// FORM DOĞRULAMA — hem AddExpenseModal (anlık alan hataları) hem
// de yukarıdaki addExpense/updateExpense (submit güvenliği) için
// tek bir kaynaktan kullanılır.
// -------------------------------------------------------------

export function validateExpenseInput(input) {
    const errors = [];

    if (!input?.name || input.name.trim().length === 0) {
        errors.push("Gider adı zorunludur.");
    }
    if (!input?.category) {
        errors.push("Kategori seçmelisiniz.");
    }
    if (!(Number(input?.amount) > 0)) {
        errors.push("Tutar 0'dan büyük olmalı.");
    }
    if (!input?.paymentMethod) {
        errors.push("Ödeme yöntemi seçmelisiniz.");
    }
    if (!input?.date) {
        errors.push("Tarih zorunludur.");
    }

    return errors;
}

export { categoryLabel, paymentMethodLabel, todayStr };
