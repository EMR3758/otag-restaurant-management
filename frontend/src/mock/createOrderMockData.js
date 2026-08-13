// =========================================================
// MOCK VERİ — Create Order sayfası
// =========================================================
//
// Backend hazır olduğunda bu dosyanın yerini API çağrıları alacak:
//   - mockTables   -> GET /tables   (RestaurantTableController)
//   - mockProducts -> GET /products (ProductController)
//
// CreateOrder.jsx bu iki listeyi ve PRODUCT_CATEGORIES'i import ediyor;
// backend'e geçişte sadece bu dosyadaki export'ları fetch sonuçlarıyla
// değiştirmek yeterli olacak, component tarafında değişiklik gerekmez.

export const mockTables = [
    { id: 1, label: "Masa 01", seats: 4, status: "AVAILABLE" },
    { id: 3, label: "Masa 03", seats: 2, status: "AVAILABLE" },
    { id: 2, label: "Masa 02", seats: 2, status: "OCCUPIED" },
    { id: 4, label: "Masa 04", seats: 6, status: "AVAILABLE" }
];


export const PRODUCT_CATEGORIES = [
    { value: "ALL", label: "Tüm Ürünler" },
    { value: "STARTER", label: "Başlangıçlar" },
    { value: "MAIN", label: "Ana Yemekler" },
    { value: "BEVERAGE", label: "İçecekler" }
];


export const mockProducts = [
    { id: 1, name: "Mercimek Çorbası", category: "STARTER", price: 45 },
    { id: 2, name: "İskender Kebap", category: "MAIN", price: 180 },
    { id: 3, name: "Ayran", category: "BEVERAGE", price: 25 },
    { id: 4, name: "Lahmacun", category: "MAIN", price: 60 }
];
