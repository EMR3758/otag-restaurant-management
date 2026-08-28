import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddProduct.css";
import Layout from "../../components/Layout.jsx";
import { KDS_STATIONS } from "../../data/mockKdsOrders.js";

// Backend'deki KdsStation enum değerleri (KITCHEN, BAR, NARGILE) value olarak,
// Türkçe etiketler sadece görünüm için kullanılır.
const KDS_STATION_OPTIONS = [
    { value: KDS_STATIONS.KITCHEN, label: "Mutfak" },
    { value: KDS_STATIONS.BAR, label: "Bar" },
    { value: KDS_STATIONS.NARGILE, label: "Nargile" }
];

function authHeaders() {
    return {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
}

function AddProduct() {

    const navigate = useNavigate();
    //useParams() URL'deki parametreleri alıyor./menu/15/edit gibi
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [stock, setStock] = useState("");
    const [kdsStation, setKdsStation] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imagePreviewFailed, setImagePreviewFailed] = useState(false);
    const [loadedCategoryName, setLoadedCategoryName] = useState("");

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(isEditMode);
    const [loadError, setLoadError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);


    // =====================================================
    // KATEGORİLERİ ÇEK
    // =====================================================

    useEffect(() => {

        fetch("http://localhost:8080/categories", { headers: authHeaders() })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Kategoriler alınamadı");
                }
                return response.json();
            })
            .then((data) => setCategories(data))
            .catch((error) => console.error("Categories load error:", error));

    }, []);


    // =====================================================
    // DÜZENLEME MODU: ÜRÜNÜ ÇEK
    // =====================================================

    useEffect(() => {

        if (!isEditMode) {
            return;
        }

        setLoading(true);
        setLoadError(null);

        fetch(`http://localhost:8080/products/${id}`, { headers: authHeaders() })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Ürün alınamadı");
                }
                return response.json();
            })
            .then((product) => {
                setName(product.name ?? "");
                setStock(String(product.stock ?? ""));
                setPrice(String(product.price ?? ""));
                setImageUrl(product.imageUrl ?? "");
                setLoadedCategoryName(product.categoryName ?? "");
                setKdsStation(product.kdsStation ?? "");
            })
            .catch((error) => {
                console.error("Product load error:", error);
                setLoadError("Ürün bilgileri yüklenemedi.");
            })
            .finally(() => setLoading(false));

    }, [id, isEditMode]);

    // Kategoriler geldikten sonra, ürünün kategori adını id'ye eşle.
    useEffect(() => {

        if (!loadedCategoryName || categories.length === 0) {
            return;
        }

        const match = categories.find((c) => c.name === loadedCategoryName);
        if (match) {
            setCategoryId(String(match.id));
        }

    }, [categories, loadedCategoryName]);

    // Kullanıcı URL'yi her değiştirdiğinde önizlemeyi yeniden dener.
    useEffect(() => {
        setImagePreviewFailed(false);
    }, [imageUrl]);


    // =====================================================
    // GÖNDER
    // =====================================================

    const validate = () => {

        const nextErrors = {};

        if (!name.trim()) {
            nextErrors.name = "Ürün adı zorunludur.";
        }

        if (!categoryId) {
            nextErrors.categoryId = "Lütfen bir kategori seçin.";
        }

        if (price === "" || Number(price) < 0 || Number.isNaN(Number(price))) {
            nextErrors.price = "Geçerli bir fiyat girin.";
        }

        if (stock === "" || Number(stock) < 0 || Number.isNaN(Number(stock))) {
            nextErrors.stock = "Geçerli bir stok miktarı girin.";
        }

        if (!kdsStation) {
            nextErrors.kdsStation = "Lütfen bir KDS istasyonu seçin.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSaving(true);

        const trimmedImageUrl = imageUrl.trim();

        const payload = {
            name: name.trim(),
            stock: Number(stock),
            price: Number(price),
            categoryId: Number(categoryId),
            imageUrl: trimmedImageUrl === "" ? null : trimmedImageUrl,
            kdsStation: kdsStation
        };

        try {

            const response = await fetch(
                isEditMode
                    ? `http://localhost:8080/products/${id}`
                    : "http://localhost:8080/products",
                {
                    method: isEditMode ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...authHeaders()
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error("Ürün kaydedilemedi");
            }

            navigate("/menu");

        } catch (error) {
            console.error("Product save error:", error);
            alert("Ürün kaydedilirken bir hata oluştu.");
        } finally {
            setIsSaving(false);
        }

    };

    const handleCancel = () => {
        navigate("/menu");
    };


    return (
        <Layout navbarType="dashboard" title="Menü">

            <div className="add-product-page">

                <div className="add-product-heading">

                    <button
                        type="button"
                        className="back-button"
                        onClick={handleCancel}
                        aria-label="Menüye dön"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>

                    <div>
                        <h1>{isEditMode ? "Ürünü Düzenle" : "Ürün Ekle"}</h1>
                        <p>
                            {isEditMode
                                ? "Bu menü öğesinin bilgilerini güncelleyin."
                                : "Menü kataloğu için yeni bir ürün oluşturun."}
                        </p>
                    </div>

                </div>

                {loadError && (
                    <div className="form-load-error">
                        {loadError}
                    </div>
                )}

                {!loading && (

                    <div className="add-product-card">

                        <form onSubmit={handleSubmit} noValidate>

                            <div className="form-grid">

                                <div className="form-field form-field-full">
                                    <label htmlFor="product_name">
                                        Ürün Adı <span className="required">*</span>
                                    </label>
                                    <input
                                        id="product_name"
                                        type="text"
                                        placeholder="örn. Lahmacun"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                    {errors.name && <span className="field-error">{errors.name}</span>}
                                </div>

                                <div className="form-field form-field-full">
                                    <label htmlFor="image_url">
                                        Ürün Görseli URL'si
                                    </label>
                                    <div className="image-url-field">

                                        <input
                                            id="image_url"
                                            type="text"
                                            placeholder="https://ornek.com/urun-gorseli.jpg"
                                            value={imageUrl}
                                            onChange={(event) => setImageUrl(event.target.value)}
                                        />

                                        <div className="image-preview">
                                            <span className="material-symbols-outlined image-preview-fallback">
                                                image
                                            </span>
                                            {imageUrl.trim() !== "" && !imagePreviewFailed && (
                                                <img
                                                    src={imageUrl}
                                                    alt="Ürün görseli önizlemesi"
                                                    onError={() => setImagePreviewFailed(true)}
                                                />
                                            )}
                                        </div>

                                    </div>
                                    <span className="field-hint">
                                        İnternetteki ürün görselinin doğrudan URL adresini girin.
                                    </span>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="category">
                                        Kategori <span className="required">*</span>
                                    </label>
                                    <div className="select-wrap">
                                        <select
                                            id="category"
                                            value={categoryId}
                                            onChange={(event) => setCategoryId(event.target.value)}
                                        >
                                            <option value="" disabled>Bir kategori seçin</option>
                                            {categories.map((category) => (
                                                <option value={category.id} key={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                    {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="stock">
                                        Stok <span className="required">*</span>
                                    </label>
                                    <div className="input-icon-wrap">
                                        <span className="material-symbols-outlined">inventory_2</span>
                                        <input
                                            id="stock"
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={stock}
                                            onChange={(event) => setStock(event.target.value)}
                                        />
                                    </div>
                                    {errors.stock && <span className="field-error">{errors.stock}</span>}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="kds_station">
                                        KDS İstasyonu <span className="required">*</span>
                                    </label>
                                    <div className="select-wrap">
                                        <select
                                            id="kds_station"
                                            value={kdsStation}
                                            onChange={(event) => setKdsStation(event.target.value)}
                                        >
                                            <option value="" disabled>Bir KDS istasyonu seçin</option>
                                            {KDS_STATION_OPTIONS.map((option) => (
                                                <option value={option.value} key={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                    {errors.kdsStation && <span className="field-error">{errors.kdsStation}</span>}
                                </div>

                                <div className="form-field form-field-full">
                                    <label htmlFor="price">
                                        Fiyat <span className="required">*</span>
                                    </label>
                                    <div className="input-icon-wrap">
                                        <span className="currency-symbol">₺</span>
                                        <input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={price}
                                            onChange={(event) => setPrice(event.target.value)}
                                        />
                                    </div>
                                    {errors.price && <span className="field-error">{errors.price}</span>}
                                </div>

                            </div>

                            <div className="form-actions">

                                <button type="button" className="secondary-button" onClick={handleCancel}>
                                    İptal
                                </button>

                                <button type="submit" className="primary-button" disabled={isSaving}>
                                    <span className="material-symbols-outlined">check</span>
                                    {isSaving ? "Kaydediliyor..." : isEditMode ? "Değişiklikleri Kaydet" : "Ürün Ekle"}
                                </button>

                            </div>

                        </form>

                    </div>

                )}

            </div>

        </Layout>
    );
}

export default AddProduct;
