// Müşteri tarafı (site) sayfaları için geçici/placeholder içerik.
// Gerçek görseller ve metinler daha sonra güncellenecek.

export const heroImage =
    "https://placehold.co/1600x900/1b1c1a/fbf9f5?text=Ota%C4%9F+Cafe";

export const categories = [
    {
        id: 1,
        name: "Burgerler",
        itemCount: 6,
        imageUrl: "https://placehold.co/800x600/9e3d00/fbf9f5?text=Burgerler"
    },
    {
        id: 2,
        name: "Pizzalar",
        itemCount: 4,
        imageUrl: "https://placehold.co/800x600/9e3d00/fbf9f5?text=Pizzalar"
    },
    {
        id: 3,
        name: "Makarnalar",
        itemCount: 3,
        imageUrl: "https://placehold.co/800x600/9e3d00/fbf9f5?text=Makarnalar"
    },
    {
        id: 4,
        name: "İçecekler",
        itemCount: 5,
        imageUrl: "https://placehold.co/800x600/9e3d00/fbf9f5?text=%C4%B0cecekler"
    },
    {
        id: 5,
        name: "Tatlılar",
        itemCount: 3,
        imageUrl: "https://placehold.co/800x600/9e3d00/fbf9f5?text=Tatlilar"
    }
];

export const featuredProducts = [
    {
        id: 1,
        name: "Klasik Burger",
        price: 320,
        imageUrl: "https://placehold.co/600x600/efeeea/1b1c1a?text=Klasik+Burger",
        description: "Dana köfte, cheddar, marul, domates.",
        badge: "ÇOK SATIYOR"
    },
    {
        id: 2,
        name: "Margarita Pizza",
        price: 280,
        imageUrl: "https://placehold.co/600x600/efeeea/1b1c1a?text=Margarita+Pizza",
        description: "Domates sos, mozzarella, fesleğen."
    },
    {
        id: 3,
        name: "Cheeseburger",
        price: 350,
        imageUrl: "https://placehold.co/600x600/efeeea/1b1c1a?text=Cheeseburger",
        description: "Duble köfte, bol cheddar."
    },
    {
        id: 4,
        name: "Kola",
        price: 80,
        imageUrl: "https://placehold.co/600x600/efeeea/1b1c1a?text=Kola"
    }
];

// FullMenu.jsx bu listeyi categoryName alanına göre filtreliyor;
// categoryName değeri yukarıdaki categories[].name ile eşleşmeli.
export const menuProducts = [
    ...featuredProducts.map((product) => ({
        ...product,
        categoryName: product.name.includes("Pizza")
            ? "Pizzalar"
            : product.name.includes("Kola")
                ? "İçecekler"
                : "Burgerler"
    })),
    {
        id: 5,
        name: "Tavuk Burger",
        price: 290,
        imageUrl: "https://placehold.co/600x600/efeeea/1b1c1a?text=Tavuk+Burger",
        description: "Izgara tavuk, marul, özel sos.",
        categoryName: "Burgerler"
    },
    {
        id: 6,
        name: "Karışık Pizza",
        price: 340,
        imageUrl: "https://placehold.co/600x600/efeeea/1b1c1a?text=Kar%C4%B1s%C4%B1k+Pizza",
        description: "Sucuk, mantar, biber, zeytin.",
        categoryName: "Pizzalar"
    },
    {
        id: 7,
        name: "Alfredo Makarna",
        price: 260,
        imageUrl: "https://placehold.co/600x600/efeeea/1b1c1a?text=Alfredo+Makarna",
        description: "Krema sos, mantar, parmesan.",
        categoryName: "Makarnalar"
    },
    {
        id: 8,
        name: "Limonata",
        price: 90,
        imageUrl: "https://placehold.co/600x600/efeeea/1b1c1a?text=Limonata",
        categoryName: "İçecekler"
    },
    {
        id: 9,
        name: "Cheesecake",
        price: 180,
        imageUrl: "https://placehold.co/600x600/efeeea/1b1c1a?text=Cheesecake",
        categoryName: "Tatlılar"
    }
];

export const campaign = {
    tag: "SINIRLI SÜRELİ",
    title: "2 Al 1 Öde: Seçili Burgerler",
    description: "Bu hafta seçili burgerlerde geçerli kampanyayı kaçırmayın.",
    ctaLabel: "Menüye Git",
    imageUrl: "https://placehold.co/1200x800/1b1c1a/fbf9f5?text=Kampanya"
};
