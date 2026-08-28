import { useState } from "react";
import "./Login.css";
import {useNavigate} from "react-router-dom";

const OTAG_LOGO_URL =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAel1bDD7DN7oPwM9sHN9PguSlNIs27RSuSNIiF9JXAYPbIl-iLtyAJomhTo5uni7GWIboabs6lcyZuNn6pMfv-5BQG72cncQgerOy_Klqx33miivD1c8VS7LW1gKnb_DVz5OGKubX2x_p4oQ97tXG12JQCr26uxK2X5mLioJpa61cFdvks850Q8co-VgwV_ebcabHsqYVSdRixeJmysuQEH-0K0N-7iKfs6duq7A_Mbp9g1WwPBokK";

const BRAND_FEATURES = [
    { icon: "account_balance_wallet", label: "Finans Yönetimi" },
    { icon: "receipt_long", label: "Gider Takibi" },
    { icon: "tune", label: "Operasyon Kontrolü" },
    { icon: "groups", label: "Ekibinizle Tek Platformda" }
];

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8080/auth/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email: email,
                password: password
            })
        });
        const data = await response.json();

        console.log("Login response:",data);

        if(response.ok){
            localStorage.setItem("token",data.token);
            // Butonların role göre gösterilip gizlenmesi (ör. Personel Ekle)
            // için rolü de saklıyoruz. Asıl yetkilendirme backend'de yapılıyor,
            // bu sadece arayüz görünürlüğü içindir.
            localStorage.setItem("userId",data.userId);
            localStorage.setItem("role",data.role);
            console.log("Token kaydedildi.");
            console.log("User ID kaydedildi",data.userId);
            navigate("/dashboard");
        }else {
            console.log("Login başarısız:",data)
        }
    };

    return (
        <div className="login-page">

            {/* SOL TARAF — MARKA / TANITIM */}
            <div className="login-brand">

                <div className="login-brand-content">

                    <div className="login-brand-top">
                        <img src={OTAG_LOGO_URL} alt="OTAĞ Logo" className="login-brand-logo" />
                        <span className="login-brand-wordmark">OTAĞ</span>
                    </div>

                    <div className="login-brand-middle">
                        <h1>Restoranınızı daha akıllı yönetin.</h1>
                        <div className="login-brand-accent"></div>
                        <p>Giderlerinizi, finansınızı ve operasyonunuzu tek bir yerden yönetin.</p>
                    </div>

                    <div className="login-brand-features">
                        {BRAND_FEATURES.map((feature) => (
                            <div className="login-brand-feature" key={feature.label}>
                                <span className="login-brand-feature-icon material-symbols-outlined">
                                    {feature.icon}
                                </span>
                                <span className="login-brand-feature-label">{feature.label}</span>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

            {/* SAĞ TARAF — GİRİŞ FORMU */}
            <div className="login-auth">

                <div className="login-container">

                    <div className="login-card">

                        {/* Logo (sadece marka kolonu gizliyken, mobilde görünür) */}
                        <div className="login-header">

                            <img
                                src={OTAG_LOGO_URL}
                                alt="OTAĞ Logo"
                                className="login-logo"
                            />

                            <h1>Tekrar hoş geldiniz</h1>

                            <p>
                                Restoran yönetim panelinize giriş yapın.
                            </p>

                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="login-form"
                        >

                            {/* Email */}
                            <div className="form-group">

                                <label htmlFor="email">
                                    E-posta
                                </label>

                                <div className="input-wrapper">

                                    <span className="material-symbols-outlined input-icon">
                                        mail
                                    </span>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@otag.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />

                                </div>

                            </div>

                            {/* Password */}
                            <div className="form-group">

                                <label htmlFor="password">
                                    Şifre
                                </label>

                                <div className="input-wrapper">

                                    <span className="material-symbols-outlined input-icon">
                                        lock
                                    </span>

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        <span className="material-symbols-outlined">
                                            {showPassword
                                                ? "visibility_off"
                                                : "visibility"}
                                        </span>
                                    </button>

                                </div>

                            </div>

                            {/* Options */}
                            <div className="login-options">

                                <label className="remember-me">

                                    <input type="checkbox" />

                                    <span>
                                        Beni hatırla
                                    </span>

                                </label>

                                <a href="#">
                                    Şifremi unuttum?
                                </a>

                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                className="login-button"
                            >
                                Giriş Yap
                            </button>

                        </form>

                        {/* Support */}
                        <div className="login-support">

                            <p>
                                Hesabınız yok mu?{" "}
                                <a href="#">
                                    Destek ile iletişime geç
                                </a>
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;
