import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import Layout from "../../components/Layout.jsx";
import DeleteConfirmModal from "../../components/DeleteConfirmModal.jsx";

function Settings() {

    const navigate = useNavigate();

    // =====================================================
    // KİŞİSEL BİLGİLER
    // =====================================================

    const [personalInfo, setPersonalInfo] = useState({
        fullName: "Emirhan",
        email: "emirhan@otag.com",
        phone: "+90 555 123 4567"
    });
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);

    const handlePersonalChange = (field) => (event) => {
        setPersonalInfo((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleToggleEditPersonal = () => {
        setIsEditingPersonal((prev) => !prev);
    };


    // =====================================================
    // TERCİHLER
    // =====================================================

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        orderAlerts: true,
        systemUpdates: false
    });

    const handleTogglePreference = (key) => {
        setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    };


    // =====================================================
    // GÜVENLİK
    // =====================================================

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showRevokeModal, setShowRevokeModal] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordErrors, setPasswordErrors] = useState({});

    const handleToggleTwoFactor = () => {
        setTwoFactorEnabled((prev) => !prev);
    };

    const handleOpenPasswordModal = () => {
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordErrors({});
        setShowPasswordModal(true);
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
    };

    const handlePasswordFieldChange = (field) => (event) => {
        setPasswordForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmitPasswordChange = (event) => {

        event.preventDefault();

        const nextErrors = {};

        if (!passwordForm.currentPassword) {
            nextErrors.currentPassword = "Mevcut şifrenizi girin.";
        }

        if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
            nextErrors.newPassword = "Yeni şifre en az 8 karakter olmalıdır.";
        }

        if (passwordForm.confirmPassword !== passwordForm.newPassword) {
            nextErrors.confirmPassword = "Şifreler eşleşmiyor.";
        }

        setPasswordErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        // TODO: Backend şifre değiştirme endpoint'i hazır olduğunda
        // burada gerçek bir API çağrısı yapılacak (fetch/POST).
        console.log("Şifre değişikliği (taslak):", passwordForm);

        setShowPasswordModal(false);

    };

    const handleRevokeAllSessions = () => {

        // TODO: Backend oturum sonlandırma endpoint'i hazır olduğunda
        // burada gerçek bir API çağrısı yapılacak (fetch/POST).
        console.log("Tüm oturumlar sonlandırılacak.");

        setShowRevokeModal(false);

    };


    // =====================================================
    // KAYDET / ÇIKIŞ YAP
    // =====================================================

    const handleSaveChanges = () => {

        const payload = {
            personalInfo,
            preferences,
            twoFactorEnabled
        };

        // TODO: Backend profil güncelleme endpoint'i hazır olduğunda
        // burada gerçek bir API çağrısı yapılacak (fetch/PUT).
        console.log("Ayarlar kaydedildi (taslak):", payload);

        setIsEditingPersonal(false);

    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    return (
        <Layout
            navbarType="dashboard"
            title="Ayarlar"
        >

            <div className="settings-page">

                {/* =================================================
                    PROFİL BAŞLIĞI
                ================================================= */}
                <section className="settings-profile">

                    <div className="settings-avatar-wrap">
                        <div className="settings-avatar">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <button
                            type="button"
                            className="settings-avatar-edit"
                            aria-label="Profil fotoğrafını düzenle"
                            onClick={() => console.log("TODO: profil fotoğrafı yükleme akışı eklenecek.")}
                        >
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                    </div>

                    <div className="settings-profile-info">
                        <div className="settings-profile-name-row">
                            <h1>{personalInfo.fullName}</h1>
                            <span className="settings-role-badge">
                                <span className="material-symbols-outlined">admin_panel_settings</span>
                                Yönetici
                            </span>
                        </div>
                        <p className="settings-profile-email">
                            <span className="material-symbols-outlined">mail</span>
                            {personalInfo.email}
                        </p>
                        <p className="settings-profile-location">
                            <span className="material-symbols-outlined">location_on</span>
                            İstanbul, Türkiye
                        </p>
                    </div>

                    <div className="settings-profile-actions">
                        <button
                            type="button"
                            className="view-public-profile-button"
                            onClick={() => console.log("TODO: herkese açık profil rotası backend hazır olduğunda bağlanacak.")}
                        >
                            Herkese Açık Profili Görüntüle
                        </button>
                    </div>

                </section>

                {/* =================================================
                    İÇERİK GRID'İ
                ================================================= */}
                <div className="settings-grid">

                    {/* ============== SOL KOLON ============== */}
                    <div className="settings-column-main">

                        {/* KİŞİSEL BİLGİLER */}
                        <article className="settings-card">

                            <div className="settings-card-head">
                                <h2>Kişisel Bilgiler</h2>
                                <button
                                    type="button"
                                    className="settings-edit-button"
                                    onClick={handleToggleEditPersonal}
                                >
                                    <span className="material-symbols-outlined">
                                        {isEditingPersonal ? "close" : "edit"}
                                    </span>
                                    {isEditingPersonal ? "Vazgeç" : "Düzenle"}
                                </button>
                            </div>

                            <div className="settings-form-grid">

                                <div className="settings-field">
                                    <label htmlFor="settings_full_name">Ad Soyad</label>
                                    <input
                                        id="settings_full_name"
                                        type="text"
                                        value={personalInfo.fullName}
                                        onChange={handlePersonalChange("fullName")}
                                        readOnly={!isEditingPersonal}
                                    />
                                </div>

                                <div className="settings-field">
                                    <label htmlFor="settings_email">E-posta Adresi</label>
                                    <input
                                        id="settings_email"
                                        type="email"
                                        value={personalInfo.email}
                                        onChange={handlePersonalChange("email")}
                                        readOnly={!isEditingPersonal}
                                    />
                                </div>

                                <div className="settings-field">
                                    <label htmlFor="settings_phone">Telefon Numarası</label>
                                    <input
                                        id="settings_phone"
                                        type="tel"
                                        value={personalInfo.phone}
                                        onChange={handlePersonalChange("phone")}
                                        readOnly={!isEditingPersonal}
                                    />
                                </div>

                                <div className="settings-field">
                                    <label htmlFor="settings_role">Sistem Rolü</label>
                                    <input
                                        id="settings_role"
                                        type="text"
                                        value="Yönetici"
                                        disabled
                                    />
                                </div>

                            </div>

                        </article>

                        {/* GÜVENLİK VE HESAP */}
                        <article className="settings-card">

                            <div className="settings-card-head">
                                <h2>Güvenlik ve Hesap</h2>
                            </div>

                            <div className="settings-security-list">

                                <div className="settings-security-row">
                                    <div className="settings-security-text">
                                        <h3>Şifre</h3>
                                        <p>Son değişiklik: 3 ay önce.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="settings-outline-button"
                                        onClick={handleOpenPasswordModal}
                                    >
                                        Şifreyi Değiştir
                                    </button>
                                </div>

                                <div className="settings-security-row">
                                    <div className="settings-security-text">
                                        <h3>İki Adımlı Doğrulama (2FA)</h3>
                                        <p>Hesabınıza ekstra bir güvenlik katmanı ekleyin.</p>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={twoFactorEnabled}
                                        className={`toggle-switch ${twoFactorEnabled ? "on" : "off"}`}
                                        onClick={handleToggleTwoFactor}
                                    >
                                        <span className="toggle-knob" />
                                    </button>
                                </div>

                                <div className="settings-security-row settings-security-row-last">
                                    <div className="settings-security-text">
                                        <h3>Aktif Oturumlar</h3>
                                        <p className="settings-session-info">
                                            <span className="session-dot" />
                                            Şu anki oturum: Mac OS, Chrome (İstanbul)
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="settings-revoke-button"
                                        onClick={() => setShowRevokeModal(true)}
                                    >
                                        <span className="material-symbols-outlined">phonelink_erase</span>
                                        Tümünü Sonlandır
                                    </button>
                                </div>

                            </div>

                        </article>

                    </div>

                    {/* ============== SAĞ KOLON ============== */}
                    <div className="settings-column-side">

                        {/* TERCİHLER */}
                        <aside className="settings-card">

                            <div className="settings-card-head">
                                <h2>Tercihler</h2>
                            </div>

                            <div className="settings-preferences-list">

                                <div className="settings-preference-row">
                                    <div className="settings-preference-label">
                                        <span className="material-symbols-outlined">mail</span>
                                        <div>
                                            <p className="settings-preference-title">E-posta Bildirimleri</p>
                                            <p className="settings-preference-desc">Günlük özetler</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={preferences.emailNotifications}
                                        className={`toggle-switch ${preferences.emailNotifications ? "on" : "off"}`}
                                        onClick={() => handleTogglePreference("emailNotifications")}
                                    >
                                        <span className="toggle-knob" />
                                    </button>
                                </div>

                                <div className="settings-preference-row">
                                    <div className="settings-preference-label">
                                        <span className="material-symbols-outlined">receipt_long</span>
                                        <div>
                                            <p className="settings-preference-title">Sipariş Uyarıları</p>
                                            <p className="settings-preference-desc">Sadece acil olanlar</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={preferences.orderAlerts}
                                        className={`toggle-switch ${preferences.orderAlerts ? "on" : "off"}`}
                                        onClick={() => handleTogglePreference("orderAlerts")}
                                    >
                                        <span className="toggle-knob" />
                                    </button>
                                </div>

                                <div className="settings-preference-row">
                                    <div className="settings-preference-label">
                                        <span className="material-symbols-outlined">desktop_windows</span>
                                        <div>
                                            <p className="settings-preference-title">Sistem Güncellemeleri</p>
                                            <p className="settings-preference-desc">Yeni özellikler ve düzeltmeler</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={preferences.systemUpdates}
                                        className={`toggle-switch ${preferences.systemUpdates ? "on" : "off"}`}
                                        onClick={() => handleTogglePreference("systemUpdates")}
                                    >
                                        <span className="toggle-knob" />
                                    </button>
                                </div>

                            </div>

                        </aside>

                        {/* AKSİYONLAR */}
                        <aside className="settings-card settings-actions-card">

                            <button
                                type="button"
                                className="settings-save-button"
                                onClick={handleSaveChanges}
                            >
                                <span className="material-symbols-outlined">save</span>
                                Değişiklikleri Kaydet
                            </button>

                            <div className="settings-logout-wrap">
                                <button
                                    type="button"
                                    className="settings-logout-button"
                                    onClick={handleLogout}
                                >
                                    <span className="material-symbols-outlined">logout</span>
                                    OTAĞ'tan Çıkış Yap
                                </button>
                            </div>

                        </aside>

                    </div>

                </div>

            </div>

            {/* =================================================
                ŞİFRE DEĞİŞTİRME MODALI
            ================================================= */}
            {showPasswordModal && (
                <div className="settings-modal-backdrop" onClick={handleClosePasswordModal}>
                    <div className="settings-modal" onClick={(event) => event.stopPropagation()}>

                        <h3>Şifreyi Değiştir</h3>

                        <form onSubmit={handleSubmitPasswordChange} noValidate>

                            <div className="settings-field">
                                <label htmlFor="current_password">Mevcut Şifre</label>
                                <input
                                    id="current_password"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordFieldChange("currentPassword")}
                                    className={passwordErrors.currentPassword ? "has-error" : ""}
                                />
                                {passwordErrors.currentPassword && (
                                    <span className="field-error">{passwordErrors.currentPassword}</span>
                                )}
                            </div>

                            <div className="settings-field">
                                <label htmlFor="new_password">Yeni Şifre</label>
                                <input
                                    id="new_password"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordFieldChange("newPassword")}
                                    className={passwordErrors.newPassword ? "has-error" : ""}
                                />
                                {passwordErrors.newPassword && (
                                    <span className="field-error">{passwordErrors.newPassword}</span>
                                )}
                            </div>

                            <div className="settings-field">
                                <label htmlFor="confirm_password">Yeni Şifre (Tekrar)</label>
                                <input
                                    id="confirm_password"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordFieldChange("confirmPassword")}
                                    className={passwordErrors.confirmPassword ? "has-error" : ""}
                                />
                                {passwordErrors.confirmPassword && (
                                    <span className="field-error">{passwordErrors.confirmPassword}</span>
                                )}
                            </div>

                            <div className="settings-modal-actions">
                                <button type="button" className="settings-outline-button" onClick={handleClosePasswordModal}>
                                    İptal
                                </button>
                                <button type="submit" className="settings-save-button">
                                    Şifreyi Güncelle
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

            <DeleteConfirmModal
                open={showRevokeModal}
                variant="neutral"
                icon="phonelink_erase"
                title="Tüm Oturumları Sonlandır?"
                message="Bu hesapla açık olan tüm oturumlar sonlandırılacak ve tekrar giriş yapmanız gerekecek. Devam etmek istiyor musunuz?"
                confirmLabel="Tümünü Sonlandır"
                cancelLabel="İptal"
                onConfirm={handleRevokeAllSessions}
                onCancel={() => setShowRevokeModal(false)}
            />

        </Layout>
    );
}

export default Settings;
