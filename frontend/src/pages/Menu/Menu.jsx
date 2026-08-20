import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Menu.css";
import Layout from "../../components/Layout.jsx";
import DeleteConfirmModal from "../../components/DeleteConfirmModal.jsx";

function formatCurrency(amount) {
    if (amount == null || Number.isNaN(amount)) {
        return "₺0,00";
    }

    return `₺${Number(amount).toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function getStockStatus(stock){
    if(stock<=0){
        return{
            key:"OUT_OF_STOCK",
            label:"STOKTA YOK",
            className:"stock-out"
        };
    }
    if(stock <= 10){
        return {
            key:"LOW_STOCK",
            label: "STOK AZ",
            className: "stock-low"
        };
    }
    return {
        key: "IN_STOCK",
        label: "STOKTA VAR",
        className: "stock-in"
    };
}

const DEFAULT_THUMB_ICON = "restaurant";

function authHeaders(){
    return{
        Authorization:`Bearer ${localStorage.getItem("token")}`
    };
}
function Menu(){
    const navigate = useNavigate();
    const [products,setProducts] = useState([]);
    const [categories,setCategories] = useState([]);
    const [loadError,setLoadError] = useState(null);
    const [searchTerm,setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedStock,setSelectedStock] = useState("ALL");
    const [viewMode,setViewMode]=useState("list");
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchProducts = async () => {
        const response = await fetch(
            "http://localhost:8080/products",
            {
                headers:authHeaders()
            }
        );
        if (!response.ok){
            throw new Error("Ürünler alınamadı");
        }
        const data = await response.json();
        setProducts(data);
    }
    const fetchCategories = async () => {
        const response = await fetch(
            "http://localhost:8080/categories",
            {
                headers:authHeaders()
            }
        );
        if (!response.ok){
            throw new Error("Kategoriler alınamadı");
        }
        const data = await response.json();
        setCategories(data);
    }

    useEffect(()=>{
        setLoadError(null);
        Promise.all([fetchProducts(),fetchCategories()]).catch((error)=>{
            console.error("Menü yüklenme hatası:",error)
            setLoadError("Ürünler yüklenirken bir hata oluştu.");
        });
    },[]);

    const filteredProducts= useMemo(()=>{
        const term = searchTerm.trim().toLowerCase();
        return products.filter((product)=>{
            const matchesSearch= term === ""||product.name?.toLowerCase().includes(term)||product.categoryName?.toLowerCase().includes(term);
            const matchesCategory = selectedCategory === "ALL" || product.categoryName === selectedCategory;
            const matchesStock = selectedStock === "ALL" || getStockStatus(product.stock).key === selectedStock;
            return matchesSearch && matchesCategory && matchesStock;
        });
    },[products,searchTerm,selectedCategory,selectedStock]);

    const hasActiveFilters = searchTerm !==  "" || selectedCategory !== "ALL" || selectedStock !== "ALL";
    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("ALL");
        setSelectedStock("ALL");
    };

    const handleAddProduct=() => {
        navigate("/menu/add");
    }
    const handleEditProduct=(product)=>{
        navigate(`/menu/${product.id}/edit`);
    };
    const handleDeleteClick = (product) => {
        setProductToDelete(product);
    };
    const handleCancelDelete = () => {
        setProductToDelete(null);
    };
    const handleConfirmDelete = async () => {
        if (!productToDelete){
            return;
        }
        setIsDeleting(true);
        try {
            const response = await fetch(
                `http://localhost:8080/products/${productToDelete.id}`,
                {
                    method: "DELETE",
                    headers: authHeaders()
                }
            );
            if (!response.ok) {
                throw new Error("Ürün silinemedi");
            }
            setProducts((prev) =>
                prev.filter((item) => item.id !== productToDelete.id)
            );
        }catch (error){
            console.error("Ürün silinirken hata:", error);
            alert("Ürün silinirken bir hata oluştu.");
        }finally {
            setIsDeleting(false);
            setProductToDelete(null);
        }


    }
    const renderThumbnail = (product, boxClassName) => {
        return (
            <div className={boxClassName}>
                <span className="material-symbols-outlined thumb-fallback-icon">
                    {DEFAULT_THUMB_ICON}
                </span>
                {product.imageUrl && (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="thumb-image"
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                )}
            </div>
        );
    };
    const renderStockBadge = (stock) => {
        const status = getStockStatus(stock);
        return(
            <span className={`stock-badge ${status.className}`}>
                <span className="stock-dot"/>{status.label}
            </span>
        );
    }
    const renderEmptyState = () => {
        return (
            <div className="menu-empty-state">
                <span className="material-symbols-outlined">search_off</span>
                <h3>Ürün bulunamadı</h3>
                <p>Arama veya filtrelerinizi değiştirmeyi deneyin.</p>
                {hasActiveFilters && (
                    <button type="button" className="clear-filters-button" onClick={handleClearFilters}>
                        Filtreleri Temizle
                    </button>
                )}
            </div>
        );
    }

    return (
        <Layout navbarType="dashboard" title="Menü">
            <div className="menu-page">
                {/* =================================================
                    SAYFA BAŞLIĞI
                ================================================= */}
                <div className="menu-header">
                    <div>
                        <h1>Menü</h1>
                        <p>Restoran ürünlerinizi ve menünüzü yönetin.</p>
                    </div>
                    <button
                        type="button"
                        className="add-product-button"
                        onClick={handleAddProduct}
                    >
                        <span className="material-symbols-outlined">
                            add
                        </span>
                        Ürün Ekle
                    </button>
                </div>


                {loadError && (
                    <div className="menu-load-error">
                        {loadError}
                    </div>
                )}
                {/* =================================================
                    ARAÇ ÇUBUĞU
                ================================================= */}
                <div className="menu-toolbar">
                    <div className="menu-search">
                        <span className="material-symbols-outlined">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Ürünleri ara..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            aria-label="Ürünleri ara"
                        />
                    </div>
                    <div className="menu-select-field">
                        <select
                            value={selectedCategory}
                            onChange={(event) =>
                                setSelectedCategory(event.target.value)
                            }
                            aria-label="Kategoriye göre filtrele"
                        >
                            <option value="ALL">
                                Tüm Kategoriler
                            </option>
                            {categories.map((category) => (
                                <option
                                    value={category.name}
                                    key={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}

                        </select>
                        <span className="material-symbols-outlined">
                            expand_more
                        </span>
                    </div>
                    <div className="menu-select-field">
                        <select
                            value={selectedStock}
                            onChange={(event) =>
                                setSelectedStock(event.target.value)
                            }
                            aria-label="Stok durumuna göre filtrele"
                        >
                            <option value="ALL">
                                Tüm Stok
                            </option>
                            <option value="IN_STOCK">
                                Stokta Var
                            </option>
                            <option value="LOW_STOCK">
                                Stok Az
                            </option>
                            <option value="OUT_OF_STOCK">
                                Stokta Yok
                            </option>
                        </select>

                        <span className="material-symbols-outlined">
                            expand_more
                        </span>

                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="clear-filters-text"
                            onClick={handleClearFilters}
                        >
                            Filtreleri Temizle
                        </button>
                    )}


                    <div className="menu-view-toggle">

                        <button
                            type="button"
                            className={viewMode === "list" ? "active" : ""}
                            onClick={() => setViewMode("list")}
                            aria-label="Liste görünümü"
                            aria-pressed={viewMode === "list"}
                            title="Liste görünümü"
                        >
                            <span className="material-symbols-outlined">
                                view_list
                            </span>
                        </button>


                        <button
                            type="button"
                            className={viewMode === "grid" ? "active" : ""}
                            onClick={() => setViewMode("grid")}
                            aria-label="Izgara görünümü"
                            aria-pressed={viewMode === "grid"}
                            title="Izgara görünümü"
                        >
                            <span className="material-symbols-outlined">
                                grid_view
                            </span>
                        </button>

                    </div>

                </div>

                {/* =================================================
                    LIST VIEW
                ================================================= */}

                {viewMode === "list" && (

                    <div className="menu-table-panel">

                        {filteredProducts.length > 0 ? (

                            <div className="menu-table-wrap">

                                <table className="menu-table">

                                    <thead>
                                    <tr>
                                        <th>Ürün</th>
                                        <th>Kategori</th>
                                        <th>Fiyat</th>
                                        <th>Stok</th>
                                        <th className="text-right">
                                            İşlemler
                                        </th>

                                    </tr>
                                    </thead>

                                    <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id}>

                                            <td>
                                                <div className="product-cell">
                                                    {renderThumbnail(product, "product-thumb")}
                                                    <span className="product-name">
                                                            {product.name}
                                                        </span>
                                                </div>
                                            </td>


                                            <td className="product-category">
                                                {product.categoryName}
                                            </td>


                                            <td className="product-price-cell">
                                                {formatCurrency(product.price)}
                                            </td>


                                            <td>
                                                {renderStockBadge(product.stock)}
                                            </td>


                                            <td className="text-right">
                                                <div className="menu-row-actions">

                                                    <button
                                                        type="button"
                                                        className="action-button"
                                                        title="Ürünü düzenle"
                                                        aria-label="Ürünü düzenle"
                                                        onClick={() =>
                                                            handleEditProduct(product)
                                                        }
                                                    >

                                                            <span className="material-symbols-outlined">
                                                                edit
                                                            </span>

                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="action-button action-button-delete"
                                                        title="Ürünü sil"
                                                        aria-label="Ürünü sil"
                                                        onClick={() =>
                                                            handleDeleteClick(product)
                                                        }
                                                    >

                                                            <span className="material-symbols-outlined">
                                                                delete
                                                            </span>

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            renderEmptyState()

                        )}

                    </div>

                )}


                {/* =================================================
                    GRID VIEW
                ================================================= */}

                {viewMode === "grid" && (

                    filteredProducts.length > 0 ? (

                        <div className="menu-grid">

                            {filteredProducts.map((product) => (

                                <div
                                    className="menu-card"
                                    key={product.id}
                                >

                                    {renderThumbnail(product, "menu-card-thumb")}


                                    <div className="menu-card-body">

                                        <h3>
                                            {product.name}
                                        </h3>

                                        <p className="menu-card-category">
                                            {product.categoryName}
                                        </p>


                                        <div className="menu-card-footer">

                                            <span className="menu-card-price">
                                                {formatCurrency(product.price)}
                                            </span>

                                            {renderStockBadge(product.stock)}

                                        </div>

                                    </div>


                                    <div className="menu-card-actions">

                                        <button
                                            type="button"
                                            className="action-button"
                                            title="Ürünü düzenle"
                                            aria-label="Ürünü düzenle"
                                            onClick={() =>
                                                handleEditProduct(product)
                                            }
                                        >

                                            <span className="material-symbols-outlined">
                                                edit
                                            </span>

                                        </button>


                                        <button
                                            type="button"
                                            className="action-button action-button-delete"
                                            title="Ürünü sil"
                                            aria-label="Ürünü sil"
                                            onClick={() =>
                                                handleDeleteClick(product)
                                            }
                                        >

                                            <span className="material-symbols-outlined">
                                                delete
                                            </span>

                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="menu-table-panel">

                            {renderEmptyState()}

                        </div>

                    )

                )}

            </div>


            <DeleteConfirmModal

                open={!!productToDelete}

                title="Ürünü Sil"

                message={
                    productToDelete
                        ? `"${productToDelete.name}" ürününü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
                        : ""
                }

                confirmLabel="Sil"

                cancelLabel="İptal"

                confirmingLabel="Siliniyor..."

                isConfirming={isDeleting}

                onConfirm={handleConfirmDelete}

                onCancel={handleCancelDelete}


            />

        </Layout>
    );

} export default Menu;