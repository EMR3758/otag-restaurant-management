import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddCategory.css";
import Layout from "../../components/Layout.jsx";

function authHeaders() {
    return {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
}

function AddCategory() {

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(isEditMode);
    const [loadError, setLoadError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);


    // =====================================================
    // DÜZENLEME MODU: KATEGORİYİ ÇEK
    // =====================================================

    useEffect(() => {

        if (!isEditMode) {
            return;
        }

        setLoading(true);
        setLoadError(null);

        fetch(`http://localhost:8080/categories/${id}`, { headers: authHeaders() })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Kategori alınamadı");
                }
                return response.json();
            })
            .then((category) => {
                setName(category.name ?? "");
                setDescription(category.description ?? "");
            })
            .catch((error) => {
                console.error("Category load error:", error);
                setLoadError("Kategori bilgileri yüklenemedi.");
            })
            .finally(() => setLoading(false));

    }, [id, isEditMode]);


    // =====================================================
    // GÖNDER
    // =====================================================

    const validate = () => {

        const nextErrors = {};

        if (!name.trim()) {
            nextErrors.name = "Kategori adı zorunludur.";
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

        const trimmedDescription = description.trim();

        const payload = {
            name: name.trim(),
            description: trimmedDescription === "" ? null : trimmedDescription
        };

        try {

            const response = await fetch(
                isEditMode
                    ? `http://localhost:8080/categories/${id}`
                    : "http://localhost:8080/categories",
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
                throw new Error("Kategori kaydedilemedi");
            }

            navigate("/categories");

        } catch (error) {
            console.error("Category save error:", error);
            alert("Kategori kaydedilirken bir hata oluştu.");
        } finally {
            setIsSaving(false);
        }

    };

    const handleCancel = () => {
        navigate("/categories");
    };


    return (
        <Layout navbarType="dashboard" title="Kategoriler">

            <div className="add-category-page">

                <div className="add-category-heading">

                    <button
                        type="button"
                        className="back-button"
                        onClick={handleCancel}
                        aria-label="Kategorilere dön"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>

                    <div>
                        <h1>{isEditMode ? "Kategoriyi Düzenle" : "Kategori Ekle"}</h1>
                        <p>
                            {isEditMode
                                ? "Bu kategorinin bilgilerini güncelleyin."
                                : "Restoranınız için yeni bir menü kategorisi oluşturun."}
                        </p>
                    </div>

                </div>

                {loadError && (
                    <div className="form-load-error">
                        {loadError}
                    </div>
                )}

                {!loading && (

                    <div className="add-category-card">

                        <form onSubmit={handleSubmit} noValidate>

                            <div className="form-field">
                                <label htmlFor="category_name">
                                    Kategori Adı <span className="required">*</span>
                                </label>
                                <input
                                    id="category_name"
                                    type="text"
                                    placeholder="örn. Sıcak İçecekler"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
                                {errors.name && <span className="field-error">{errors.name}</span>}
                            </div>

                            <div className="form-field">
                                <label htmlFor="category_description">
                                    Açıklama <span className="optional">(İsteğe bağlı)</span>
                                </label>
                                <textarea
                                    id="category_description"
                                    rows="4"
                                    placeholder="Bu kategorideki ürünlerin kısa açıklaması..."
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                            </div>

                            <div className="form-actions">

                                <button type="button" className="secondary-button" onClick={handleCancel}>
                                    İptal
                                </button>

                                <button type="submit" className="primary-button" disabled={isSaving}>
                                    {isSaving ? "Kaydediliyor..." : "Kategoriyi Kaydet"}
                                </button>

                            </div>

                        </form>

                    </div>

                )}

            </div>

        </Layout>
    );
}

export default AddCategory;
