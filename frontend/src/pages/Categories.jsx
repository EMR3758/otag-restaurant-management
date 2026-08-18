import{useEffect,useState,useMemo,use} from "react";
import {useNavigate} from "react-router-dom";
import "./Categories.css";
import Layout from "../components/Layout.jsx";
import DeleteConfirmModal from "../components/DeleteConfirmModal.jsx";

const ITEM_PER_PAGE = 6;
const DEFAULT_CATEGORY_ICON ="category";

function authHeaders(){
    return{
        Authorization:`Bearer ${localStorage.getItem("token")}`
    }
}
function Categories(){
    const navigate = useNavigate();
    const [categories,setCategories] = useState([]);
    const[product,setProducts] = useState([]);

    const[loadEror,setLoadError]=useState(null);
    const[searchTerm,setSearchTerm]=useState("");
    const[currentPage,setCurrentPage]=useState(1);
    const[categoryToDelete,setCategoryToDelete]=useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchCategories = async () => {
        const response = await fetch("http://localhost:8080/categories",{
            headers:authHeaders()
        });
        if(!response.ok){throw new Error("Kategoriler alınamadı")}
        const data = await response.json();
        setCategories(data);
    };

    const fetchProducts = async () => {
        const response = await fetch(
            "http://localhost:8080/products",
            {
                headers:authHeaders()
            });
        if (!response.ok){
            throw new Error("Ürünler alınamadı")
        }
        const data = await response.json();
        setProducts(data);
    };

    useEffect(() => {
        setLoadError(null);
        Promise.all([fetchCategories(),fetchProducts()]).catch((error) => {
            console.error("Kategoriler yüklenme hatası:"+error);
            setLoadError("Kategoriler yüklenirken bir hata oluştu.");
        });
    }, []);

    const productCountByIdCategory = useMemo(()=>{
        const counts = {};
        products.forEach((product)=>{
            const key = product.categoryName;
            if(!key){return}
            counts[key]=(counts[key] ?? 0) +1;
        });
        return counts;
    },[products]);

    const filteredCategories = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return categories.filter((category)=>{
            return(term==="" || category.name?.toLowerCase().includes(term) || category.description?.toLowerCase().includes(term));
        });
    },[categories,searchTerm]);
    const hasActiveFilters = searchTerm !== "";
    const handleClearFilters = () => {
        setSearchTerm("");
        setCurrentPage(1)
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const totalItems = filteredCategories.length;
    const totalPages = Math.max(1,Math.ceil(totalItems/ITEM_PER_PAGE));
    const safePage = Math.min(currentPage,totalPages);
    const startIndex = (safePage-1)*ITEM_PER_PAGE;
    const pageCategories = filteredCategories.slice(startIndex,startIndex+ITEM_PER_PAGE);
    const rangeStart = totalItems === 0 ? 0 : startIndex+1;
    const rangeEnd = Math.min(startIndex+ITEM_PER_PAGE,totalItems);
    const goToPrevPage = () => {
        setCurrentPage((page) => Math.max(1, page - 1));
    };
    const goToNextPage = () => {
        setCurrentPage((page) => Math.min(totalPages, page + 1));
    };
    const renderEmptyState = () => {
        return (
            <div className="categories-empty-state">
                <span className="material-symbols-outlined">search_off</span>
                <h3>Kategori bulunamadı</h3>
                <p>Arama veya filtrelerinizi değiştirmeyi deneyin.</p>
                {hasActiveFilters && (
                    <button type="button" className="clear-filters-button" onClick={handleClearFilters}>
                        Filtreleri Temizle
                    </button>
                )}
            </div>
        );
    };

    return (
        <Layout navbarType="dashboard" title="Kategoriler">
            <div className="categories-page">

                {/* =================================================
                SAYFA BAŞLIĞI
            ================================================= */}
                <div className="categories-header">
                    <div>
                        <h1>Kategoriler</h1>
                        <p>Menü ürünlerinizi kategoriler halinde düzenleyin.</p>
                    </div>
                    <button
                        type="button"
                        className="add-category-button"
                        onClick={handleAddCategory}
                    >
                        <span className="material-symbols-outlined">add</span>
                        Kategori Ekle
                    </button>
                </div>

                {loadError && (
                    <div className="categories-load-error">
                        {loadError}
                    </div>
                )}

                {/* =================================================
                İÇERİK KARTI
            ================================================= */}
                <div className="categories-card">

                    {/* ARAÇ ÇUBUĞU */}
                    <div className="categories-toolbar">
                        <div className="categories-search">
                            <span className="material-symbols-outlined">search</span>
                            <input
                                type="text"
                                placeholder="Kategori ara..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                aria-label="Kategori ara"
                            />
                            {searchTerm !== "" && (
                                <button
                                    type="button"
                                    className="categories-search-clear"
                                    onClick={handleClearFilters}
                                    aria-label="Aramayı temizle"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            )}
                        </div>

                        <button type="button" className="categories-filter-button">
                            <span className="material-symbols-outlined">filter_list</span>
                            Filtre
                        </button>
                    </div>

                    {/* TABLO */}
                    {pageCategories.length > 0 ? (

                        <div className="categories-table-wrap">
                            <table className="categories-table">
                                <thead>
                                <tr>
                                    <th>Kategoriler</th>
                                    <th>Açıklama</th>
                                    <th>Ürünler</th>
                                    <th className="text-right">Eylem</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pageCategories.map((category) => {
                                    const productCount = productCountByCategory[category.name] ?? 0;
                                    return (
                                        <tr key={category.id}>
                                            <td>
                                                <div className="category-cell">
                                                    <div className="category-icon-box">
                                                    <span className="material-symbols-outlined">
                                                        {DEFAULT_CATEGORY_ICON}
                                                    </span>
                                                    </div>
                                                    <span className="category-name">
                                                    {category.name}
                                                </span>
                                                </div>
                                            </td>

                                            <td className="category-description">
                                                {category.description || "-"}
                                            </td>

                                            <td>
                                            <span className="category-count-badge">
                                                {productCount} ürün
                                            </span>
                                            </td>

                                            <td className="text-right">
                                                <div className="category-row-actions">
                                                    <button
                                                        type="button"
                                                        className="action-button"
                                                        title="Kategoriyi düzenle"
                                                        aria-label="Kategoriyi düzenle"
                                                        onClick={() => handleEditCategory(category)}
                                                    >
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-button action-button-delete"
                                                        title="Kategoriyi sil"
                                                        aria-label="Kategoriyi sil"
                                                        onClick={() => handleDeleteClick(category)}
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>

                    ) : (

                        renderEmptyState()

                    )}

                    {/* SAYFALAMA */}
                    <div className="categories-pagination">
                    <span>
                        {totalItems === 0
                            ? "Kategori yok"
                            : `Toplam ${totalItems} siparişten ${rangeStart}-${rangeEnd} arası gösteriliyor`}
                    </span>

                        <div className="pagination-buttons">
                            <button
                                onClick={goToPrevPage}
                                disabled={safePage <= 1}
                            >
                                Önce
                            </button>

                            <button
                                onClick={goToNextPage}
                                disabled={safePage >= totalPages}
                            >
                                Sonra
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            <DeleteConfirmModal
                open={!!categoryToDelete}
                title="Delete Category"
                message={
                    categoryToDelete
                        ? `Are you sure you want to delete the "${categoryToDelete.name}" category? This will not delete the products inside it, but they will become uncategorized. This action cannot be undone.`
                        : ""
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmingLabel="Siliniyor..."
                isConfirming={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

        </Layout>
    );
}
export default Categories;
