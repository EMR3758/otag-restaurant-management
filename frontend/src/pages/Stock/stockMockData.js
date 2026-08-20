// =============================================================
// STOK MOCK VERİSİ + "API" KATMANI
// =============================================================
//
// Henüz backend yok. Bu dosya, gerçek bir REST API varmış gibi
// davranan fonksiyonlar (hepsi Promise döner) ve mock veriyi tek
// yerde tutar. Stock.jsx bu fonksiyonları çağırır, mock veriye
// veya iç yapıya asla doğrudan erişmez.
//
// GERÇEK BACKEND GELDİĞİNDE: sadece bu dosyadaki fonksiyonların
// GÖVDESİNİ, "http://localhost:8080/stocks" vb. gerçek fetch
// çağrılarıyla değiştirmeniz yeterli — Stock.jsx ve modallarda
// hiçbir değişiklik gerekmez. Örnek:
//
//   export function fetchStockItems() {
//       return fetch("http://localhost:8080/stocks", { headers: authHeaders() })
//           .then((res) => res.json());
//   }
//
// =============================================================

export const STOCK_CATEGORIES = [
    "Sıcak İçecekler",
    "Soğuk İçecekler",
    "Nargile",
    "Sebze & Meyve",
    "Süt Ürünleri",
    "Temel Gıda"
];

export const STOCK_STATUS = {
    NORMAL: "NORMAL",
    CRITICAL: "CRITICAL",
    OUT_OF_STOCK: "OUT_OF_STOCK"
};

export const STOCK_STATUS_LABELS = {
    NORMAL: "Normal",
    CRITICAL: "Kritik",
    OUT_OF_STOCK: "Stokta Yok"
};

// currentStock/minimumStock karşılaştırmasından durumu hesaplar.
// Backend'e geçildiğinde bu fonksiyon aynı şekilde kalabilir (backend
// ham stok sayılarını döndürür, durum yine burada türetilir) ya da
// backend "status" alanını doğrudan döndürürse bu fonksiyon kaldırılabilir.
export function getStockStatus(item) {
    if (item.currentStock === 0) {
        return STOCK_STATUS.OUT_OF_STOCK;
    }
    if (item.currentStock <= item.minimumStock) {
        return STOCK_STATUS.CRITICAL;
    }
    return STOCK_STATUS.NORMAL;
}

// -------------------------------------------------------------
// İç veri (mock) — modül seviyesinde tutuluyor ki stok
// girişi/çıkışı yapıldığında state gerçekten kalıcı güncellensin.
// -------------------------------------------------------------

let stockItems = [
    { id: 1, productName: "Türk Kahvesi", category: "Sıcak İçecekler", currentStock: 2.4, minimumStock: 1, unit: "kg" },
    { id: 2, productName: "Filtre Kahve", category: "Sıcak İçecekler", currentStock: 0.7, minimumStock: 1, unit: "kg" },
    { id: 3, productName: "Çay", category: "Sıcak İçecekler", currentStock: 5, minimumStock: 2, unit: "kg" },
    { id: 4, productName: "Espresso Çekirdeği", category: "Sıcak İçecekler", currentStock: 3.5, minimumStock: 2, unit: "kg" },
    { id: 5, productName: "Nargile Tütünü", category: "Nargile", currentStock: 1.2, minimumStock: 2, unit: "kg" },
    { id: 6, productName: "Nargile Kömürü", category: "Nargile", currentStock: 0, minimumStock: 5, unit: "kg" },
    { id: 7, productName: "Limon", category: "Sebze & Meyve", currentStock: 12, minimumStock: 20, unit: "adet" },
    { id: 8, productName: "Nane", category: "Sebze & Meyve", currentStock: 0.5, minimumStock: 0.5, unit: "kg" },
    { id: 9, productName: "Portakal", category: "Sebze & Meyve", currentStock: 10, minimumStock: 5, unit: "kg" },
    { id: 10, productName: "Kola", category: "Soğuk İçecekler", currentStock: 0, minimumStock: 12, unit: "adet" },
    { id: 11, productName: "Su", category: "Soğuk İçecekler", currentStock: 48, minimumStock: 24, unit: "adet" },
    { id: 12, productName: "Maden Suyu", category: "Soğuk İçecekler", currentStock: 0, minimumStock: 10, unit: "adet" },
    { id: 13, productName: "Süt", category: "Süt Ürünleri", currentStock: 8, minimumStock: 10, unit: "lt" },
    { id: 14, productName: "Krema", category: "Süt Ürünleri", currentStock: 4, minimumStock: 2, unit: "lt" },
    { id: 15, productName: "Toz Şeker", category: "Temel Gıda", currentStock: 6, minimumStock: 3, unit: "kg" },
    { id: 16, productName: "Bal", category: "Temel Gıda", currentStock: 1, minimumStock: 1, unit: "kg" }
];

let stockMovements = {
    1: [
        { id: 101, date: "2026-08-20T09:10:00", type: "IN", quantity: 1, note: "Haftalık alım" },
        { id: 102, date: "2026-08-15T18:40:00", type: "OUT", quantity: 0.6, note: "Mutfak kullanımı" }
    ],
    2: [
        { id: 103, date: "2026-08-19T11:15:00", type: "OUT", quantity: 0.5, note: "Yoğun hafta sonu kullanımı" }
    ],
    5: [
        { id: 104, date: "2026-08-18T14:00:00", type: "OUT", quantity: 0.8, note: "Nargile servisi" }
    ],
    6: [
        { id: 105, date: "2026-08-17T20:30:00", type: "OUT", quantity: 5, note: "Son paket tükendi" }
    ],
    7: [
        { id: 106, date: "2026-08-16T10:00:00", type: "IN", quantity: 10, note: "Yeni ürün alımı" },
        { id: 107, date: "2026-08-19T13:20:00", type: "OUT", quantity: 18, note: "Mutfak kullanımı" }
    ],
    10: [
        { id: 108, date: "2026-08-14T19:00:00", type: "OUT", quantity: 12, note: "Stok tükendi" }
    ]
};

let nextMovementId = 200;

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

// -------------------------------------------------------------
// "API" fonksiyonları (şimdilik mock, imzaları backend'e hazır)
// -------------------------------------------------------------

export function fetchStockItems() {
    return Promise.resolve(clone(stockItems));
}

export function fetchStockMovements(stockItemId) {
    const movements = stockMovements[stockItemId] ?? [];
    return Promise.resolve(clone(movements));
}

export function addStockEntry(stockItemId, amount, note) {
    const item = stockItems.find((candidate) => candidate.id === stockItemId);

    if (!item) {
        return Promise.reject(new Error("Ürün bulunamadı."));
    }
    if (!(amount > 0)) {
        return Promise.reject(new Error("Eklenecek miktar 0'dan büyük olmalı."));
    }

    item.currentStock = Math.round((item.currentStock + amount) * 100) / 100;

    const movement = {
        id: nextMovementId++,
        date: new Date().toISOString(),
        type: "IN",
        quantity: amount,
        note: note?.trim() || "Stok girişi"
    };

    stockMovements[stockItemId] = [movement, ...(stockMovements[stockItemId] ?? [])];

    return Promise.resolve({ item: { ...item }, movement });
}

export function addStockExit(stockItemId, amount, reason) {
    const item = stockItems.find((candidate) => candidate.id === stockItemId);

    if (!item) {
        return Promise.reject(new Error("Ürün bulunamadı."));
    }
    if (!(amount > 0)) {
        return Promise.reject(new Error("Çıkış miktarı 0'dan büyük olmalı."));
    }
    if (amount > item.currentStock) {
        return Promise.reject(new Error("Çıkış miktarı mevcut stoktan fazla olamaz."));
    }

    item.currentStock = Math.round((item.currentStock - amount) * 100) / 100;

    const movement = {
        id: nextMovementId++,
        date: new Date().toISOString(),
        type: "OUT",
        quantity: amount,
        note: reason?.trim() || "Stok çıkışı"
    };

    stockMovements[stockItemId] = [movement, ...(stockMovements[stockItemId] ?? [])];

    return Promise.resolve({ item: { ...item }, movement });
}
