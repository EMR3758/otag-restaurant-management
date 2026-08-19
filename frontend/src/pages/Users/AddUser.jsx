import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddUser.css";
import Layout from "../../components/Layout.jsx";

const ROLE_LABELS = {
    ADMIN : "Admin",
    MANAGER: "Müdür",
    CHEF :"Chef",
    WAITER: "Garson",
    CUSTOMER: "Müşteri"
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AddUser() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);


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

        if (!password || password.length < 8) {
            nextErrors.password = "Şifre en az 8 karakter olmalıdır.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;

    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!validate()){
            return
        }
        setIsSubmitting(true);
        try{
            const response = await fetch("http://localhost:8080/users",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                },
                body:JSON.stringify({
                    fullName: fullName.trim(),
                    email: email.trim(),
                    role: role,
                    password: password,
                    active: isActive
                })
            });
            if (!response.ok){
                throw new Error("Kullanıcı oluşturulamadı.")
            }
            navigate("/users");
        }catch(error){
            console.error("Kullanıcı oluşturulurken hata:", error);
            alert("Kullanıcı oluşturulurken bir hata oluştu.");
        }finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/users");
    };

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleToggleActive = () => {
        setIsActive((prev) => !prev);
    };

    return (
        <Layout
            navbarType="tables"
            searchPlaceholder="Kullanıcı ara..."
        >

            <div className="add-user-page">
                <nav className="add-user-breadcrumb" aria-label="breadcrumb">
                    <Link to="/users">Kullanıcılar</Link>
                    <span className="material-symbols-outlined">
                        chevron_right
                    </span>
                    <span className="current">
                        Kullanıcı Ekle
                    </span>
                </nav>


                <div className="add-user-heading">
                    <h1>Kullanıcı Ekle</h1>
                    <p>Yeni bir personel hesabı oluşturun ve rolünü belirleyin.</p>
                </div>


                <div className="add-user-card">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-section">
                            <h3>Kişisel Bilgiler</h3>
                            <div className="form-grid">
                                <div className="form-field form-field-full">
                                    <label htmlFor="full_name">Ad Soyad
                                        <span className="required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="full_name"
                                        type="text"
                                        placeholder="Örn. Ahmet Yılmaz"
                                        value={fullName}
                                        onChange={(event) =>
                                            setFullName(event.target.value)
                                        }
                                        className={
                                            errors.fullName
                                                ? "has-error"
                                                : ""
                                        }
                                    />

                                    {errors.fullName && (
                                        <span className="field-error">

                                            <span className="material-symbols-outlined">
                                                error
                                            </span>

                                            {errors.fullName}

                                        </span>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="email">
                                        E-posta Adresi
                                        <span className="required">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="ahmet@otag.com"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        className={
                                            errors.email
                                                ? "has-error"
                                                : ""
                                        }
                                    />

                                    {errors.email && (
                                        <span className="field-error">

                                            <span className="material-symbols-outlined">
                                                error
                                            </span>
                                            {errors.email}
                                        </span>
                                    )}
                                </div>


                                <div className="form-field">
                                    <label htmlFor="role">Sistem Rolü
                                        <span className="required">
                                            *
                                        </span>
                                    </label>
                                    <div className="select-wrap">
                                        <select
                                            id="role"
                                            value={role}
                                            onChange={(event) =>
                                                setRole(event.target.value)
                                            }
                                            className={
                                                errors.role
                                                    ? "has-error"
                                                    : ""
                                            }
                                        >
                                            <option
                                                value=""
                                                disabled
                                            >
                                                Bir rol seçin
                                            </option>

                                            {Object.entries(ROLE_LABELS).map(
                                                ([roleValue, roleLabel]) => (
                                                    <option
                                                        value={roleValue}
                                                        key={roleValue}
                                                    >
                                                        {roleLabel}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        <span className="material-symbols-outlined">
                                            expand_more
                                        </span>
                                    </div>
                                    {errors.role && (
                                        <span className="field-error">

                                            <span className="material-symbols-outlined">
                                                error
                                            </span>
                                            {errors.role}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className="form-section">

                            <h3>Güvenlik</h3>
                            <div className="form-grid">
                                <div className="form-field">
                                    <label htmlFor="password">
                                        Geçici Şifre
                                        <span className="required">
                                            *
                                        </span>
                                    </label>
                                    <div className="password-field">
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(event.target.value)
                                            }
                                            className={
                                                errors.password
                                                    ? "has-error"
                                                    : ""
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={handleTogglePassword}
                                            aria-label={
                                                showPassword
                                                    ? "Şifreyi gizle"
                                                    : "Şifreyi göster"
                                            }
                                        >
                                            <span className="material-symbols-outlined">
                                                {
                                                    showPassword
                                                        ? "visibility_off"
                                                        : "visibility"
                                                }
                                            </span>
                                        </button>
                                    </div>

                                    <span className="field-hint">
                                        En az 8 karakter olmalıdır.
                                    </span>
                                    {errors.password && (
                                        <span className="field-error">
                                            <span className="material-symbols-outlined">
                                                error
                                            </span>
                                            {errors.password}
                                        </span>
                                    )}
                                </div>

                                <div className="form-field">
                                    <div className="active-toggle-box">
                                        <div className="active-toggle-text">
                                            <span className="active-toggle-title">
                                                Aktif Hesap
                                            </span>
                                            <span className="active-toggle-desc">
                                                Kullanıcı hemen giriş yapabilir
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={isActive}
                                            className={`toggle-switch ${
                                                isActive
                                                    ? "on"
                                                    : "off"
                                            }`}
                                            onClick={handleToggleActive}
                                        >
                                            <span className="toggle-knob" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                İptal
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={isSubmitting}
                            >

                                <span className="material-symbols-outlined">
                                    person_add
                                </span>

                                {
                                    isSubmitting
                                        ? "Oluşturuluyor..."
                                        : "Kullanıcı Oluştur"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default AddUser;