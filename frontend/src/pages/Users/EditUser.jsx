import {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditUser.css";
import Layout from "../../components/Layout.jsx";
import DeleteConfirmModal from "../../components/DeleteConfirmModal.jsx";

const ROLE_LABELS = {
    ADMIN: "Admin",
    MANAGER: "Manager",
    CHEF:"Chef",
    WAITER:"Garson",
    CUSTOMER:"Müşteri"
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EditUser() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [isActive, setIsActive] = useState(true);

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    // =====================================================
    // KULLANICIYI BACKEND'DEN ÇEK
    // =====================================================

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/users/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Kullanıcı bilgileri alınamadı.");
                }

                const data = await response.json();

                setFullName(data.fullName ?? "");
                setEmail(data.email ?? "");
                setRole(data.role ?? "");
                setIsActive(data.active ?? true);

            } catch (error) {
                console.error("Kullanıcı bilgileri alınırken hata:", error);
                alert("Kullanıcı bilgileri alınamadı.");
                navigate("/users");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [id, navigate]);


    const handleBackToList = () => {
        navigate("/users");
    };


    const validate = () => {

        const nextErrors = {};

        if (!fullName.trim()) {
            nextErrors.fullName = "Ad Soyad zorunludur.";
        }

        if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
            nextErrors.email = "Geçerli bir e-posta adresi girin.";
        }

        if (!role) {
            nextErrors.role = "Lütfen bir rol seçin.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        const payload = {
            fullName: fullName.trim(),
            email: email.trim(),
            role,
            active: isActive
        };

        try {

            const response = await fetch(`http://localhost:8080/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Kullanıcı güncellenemedi");
            }

            navigate("/users");

        } catch (error) {
            console.error("Kullanıcı güncellenirken hata:", error);
            alert("Kullanıcı güncellenirken bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }

    };

    const handleToggleActive = () => {
        setIsActive((prev) => !prev);
    };


    // =====================================================
    // ŞİFRE SIFIRLAMA BAĞLANTISI
    // =====================================================

    const handleSendResetLink = () => {

        // TODO: Backend şifre sıfırlama endpoint'i hazır olduğunda
        // burada gerçek bir API çağrısı yapılacak (fetch/POST).
        console.log("Şifre sıfırlama bağlantısı gönderilecek:", email);

    };


    // =====================================================
    // KULLANICIYI SİL
    // =====================================================

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = async () => {

        setIsSubmitting(true);

        try {

            const response = await fetch(`http://localhost:8080/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("Kullanıcı silinemedi");
            }

            setShowDeleteModal(false);
            navigate("/users");

        } catch (error) {
            console.error("Kullanıcı silinirken hata:", error);
            alert("Kullanıcı silinirken bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }

    };


    if (isLoading) {
        return (
            <Layout
                navbarType="tables"
                searchPlaceholder="Kullanıcı ara..."
            >
                <div className="edit-user-page">
                    <div className="edit-user-not-found">
                        <h2>Yükleniyor...</h2>
                        <p>Kullanıcı bilgileri getiriliyor.</p>
                    </div>
                </div>
            </Layout>
        );
    }


    return (
        <Layout
            navbarType="tables"
            searchPlaceholder="Kullanıcı ara..."
        >

            <div className="edit-user-page">

                <div className="edit-user-heading">

                    <button
                        type="button"
                        className="back-button"
                        onClick={handleBackToList}
                        aria-label="Kullanıcılara dön"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>

                    <div>
                        <h1>Kullanıcıyı Düzenle</h1>
                        <p>{fullName} için hesap bilgilerini ve yetkilerini yönetin.</p>
                    </div>

                </div>

                <div className="edit-user-form-wrap">

                    <form onSubmit={handleSubmit}>

                        {/* =========================================
                            GENEL BİLGİLER
                        ========================================= */}

                        <div className="edit-user-card">

                            <div className="edit-user-card-head">
                                <h3>Genel Bilgiler</h3>
                            </div>

                            <div className="form-grid">

                                <div className="form-field">
                                    <label htmlFor="full_name">Ad Soyad</label>
                                    <input
                                        id="full_name"
                                        type="text"
                                        value={fullName}
                                        onChange={(event) => setFullName(event.target.value)}
                                        className={errors.fullName ? "has-error" : ""}
                                    />
                                    {errors.fullName && (
                                        <span className="field-error">
                                            <span className="material-symbols-outlined">error</span>
                                            {errors.fullName}
                                        </span>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="email">E-posta Adresi</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        className={errors.email ? "has-error" : ""}
                                    />
                                    {errors.email && (
                                        <span className="field-error">
                                            <span className="material-symbols-outlined">error</span>
                                            {errors.email}
                                        </span>
                                    )}
                                </div>

                                <div className="form-field form-field-full">
                                    <label htmlFor="role">Sistem Rolü</label>
                                    <div className="select-wrap">
                                        <select
                                            id="role"
                                            value={role}
                                            onChange={(event) => setRole(event.target.value)}
                                            className={errors.role ? "has-error" : ""}
                                        >
                                            {Object.entries(ROLE_LABELS).map(([roleValue, roleLabel]) => (
                                                <option value={roleValue} key={roleValue}>{roleLabel}</option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                    {errors.role && (
                                        <span className="field-error">
                                            <span className="material-symbols-outlined">error</span>
                                            {errors.role}
                                        </span>
                                    )}
                                </div>

                            </div>

                            <div className="account-status-row">
                                <div className="account-status-text">
                                    <span className="account-status-title">Hesap Durumu</span>
                                    <span className="account-status-desc">SİSTEME ERİŞİMİ AÇ VEYA KAPAT</span>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={isActive}
                                    className={`toggle-switch ${isActive ? "on" : "off"}`}
                                    onClick={handleToggleActive}
                                >
                                    <span className="toggle-knob" />
                                </button>
                            </div>

                        </div>

                        {/* =========================================
                            GÜVENLİK
                        ========================================= */}

                        <div className="edit-user-card">

                            <div className="edit-user-card-head">
                                <h3>Güvenlik</h3>
                            </div>

                            <div className="password-management-row">
                                <div className="password-management-text">
                                    <span className="password-management-title">Şifre Yönetimi</span>
                                    <span className="password-management-desc">
                                        Kullanıcının e-posta adresine, şifresini sıfırlamasını sağlayacak güvenli bir bağlantı gönderin.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="reset-link-button"
                                    onClick={handleSendResetLink}
                                >
                                    <span className="material-symbols-outlined">mail</span>
                                    Sıfırlama Bağlantısı Gönder
                                </button>
                            </div>

                        </div>

                        {/* =========================================
                            TEHLİKELİ ALAN
                        ========================================= */}

                        <div className="danger-zone-card">

                            <h3>
                                <span className="material-symbols-outlined">warning</span>
                                Tehlikeli Alan
                            </h3>

                            <div className="danger-zone-row">
                                <p>
                                    Bu kullanıcıyı silmek, erişimini kalıcı olarak kaldırır ve kişisel verilerini
                                    sistemden temizler. Bu işlem geri alınamaz.
                                </p>
                                <button
                                    type="button"
                                    className="delete-user-button"
                                    onClick={handleDeleteClick}
                                >
                                    Kullanıcıyı Sil
                                </button>
                            </div>

                        </div>

                        {/* =========================================
                            ALT AKSİYON ÇUBUĞU
                        ========================================= */}

                        <div className="edit-user-actions">
                            <button type="button" className="secondary-button" onClick={handleBackToList}>
                                İptal
                            </button>
                            <button type="submit" className="primary-button" disabled={isSubmitting}>
                                {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                            </button>
                        </div>

                    </form>

                </div>

            </div>

            <DeleteConfirmModal
                open={showDeleteModal}
                title="Kullanıcıyı Sil?"
                message={`"${fullName}" adlı kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm erişim yetkileri kaybedilir.`}
                confirmLabel="Evet, Sil"
                cancelLabel="İptal"
                icon="delete_forever"
                isConfirming={isSubmitting}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

        </Layout>
    );
}

export default EditUser;
