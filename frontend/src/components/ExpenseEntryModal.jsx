import { useRef, useState } from "react";
import "./ExpenseEntryModal.css";
import { PAYMENT_METHODS, todayStr } from "../pages/Finance/financeMockData.js";

// Backend'deki ExpenseCategory enum'u (ExpenseCategoryDetector) ile birebir eşleşen
// değerler + ekranda gösterilecek Türkçe etiketler. Bu, manuel gider ekleme akışında
// kullanılan EXPENSE_CATEGORIES (financeMockData.js) ile KARIŞTIRILMAMALI: OCR backend'i
// bu enum değerlerini üretiyor, manuel form ise farklı bir kategori seti kullanıyor.
const OCR_EXPENSE_CATEGORIES = [
    { value: "RAW_MATERIAL", label: "Hammadde" },
    { value: "BEVERAGE", label: "İçecek" },
    { value: "FOOD", label: "Yiyecek" },
    { value: "UTILITIES", label: "Fatura (Elektrik/Su/Doğalgaz)" },
    { value: "CLEANING", label: "Temizlik" },
    { value: "EQUIPMENT", label: "Ekipman" },
    { value: "FUEL", label: "Yakıt" },
    { value: "RENT", label: "Kira" },
    { value: "INTERNET", label: "İnternet" },
    { value: "GSM", label: "GSM" },
    { value: "PHONE", label: "Sabit Telefon" },
    { value: "SUBSCRIPTION", label: "Abonelik" },
    { value: "SERVICE", label: "Servis / Bakım" },
    { value: "PERSONNEL", label: "Personel" },
    { value: "TAX", label: "Vergi" },
    { value: "MARKETING", label: "Pazarlama" },
    { value: "OTHER", label: "Diğer" }
];

const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"];
const OCR_ENDPOINT = "http://localhost:8080/api/ocr/receipt";

function authHeaders() {
    return {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };
}

function isAcceptedFile(file) {
    const lowerName = file.name.toLowerCase();
    return ACCEPTED_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
}

// Backend'den gelen ham Expense listesini, formda düzenlenebilir hale getirir.
// Backend henüz kaydedilmediği için id=null gelir; React key'i için yerel bir id üretilir.
// ExpenseParser henüz satır bazında date set etmiyor, bu yüzden date boşsa bugüne düşülür.
function toEditableExpenses(rawExpenses) {
    return rawExpenses.map((expense, index) => ({
        _localId: `${Date.now()}-${index}`,
        name: expense.name ?? "",
        category: expense.category ?? "OTHER",
        quantity: expense.quantity ? String(expense.quantity) : "",
        unit: expense.unit ?? "",
        amount: expense.amount != null ? String(expense.amount) : "",
        date: expense.date ? String(expense.date).slice(0, 10) : todayStr(),
        paymentMethod: "",
        description: expense.description ?? ""
    }));
}

// mode: "choose" -> "upload" -> "review"
// onManualAdd: kullanıcı "Manuel Gider Ekle" seçerse çağrılır (bu modal kapanır, mevcut AddExpenseModal açılır)
// onSaved: kullanıcı incelenmiş satırlarla "Kaydet"e basınca çağrılır (henüz backend'e yazmaz)
function ExpenseEntryModal({ open, onClose, onManualAdd, onSaved }) {

    const [step, setStep] = useState("choose");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [reviewExpenses, setReviewExpenses] = useState([]);
    const fileInputRef = useRef(null);

    if (!open) {
        return null;
    }

    const resetAndClose = () => {
        setStep("choose");
        setSelectedFile(null);
        setIsDragActive(false);
        setIsUploading(false);
        setUploadError(null);
        setReviewExpenses([]);
        onClose();
    };

    const handleFileChosen = (file) => {
        if (!file) {
            return;
        }
        if (!isAcceptedFile(file)) {
            setUploadError("Desteklenmeyen dosya türü. Lütfen JPG, JPEG, PNG veya PDF yükleyin.");
            return;
        }
        setUploadError(null);
        setSelectedFile(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragActive(false);
        handleFileChosen(event.dataTransfer.files?.[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadError("Lütfen önce bir fiş/fatura dosyası seçin.");
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await fetch(OCR_ENDPOINT, {
                method: "POST",
                headers: authHeaders(),
                body: formData
            });

            if (!response.ok) {
                throw new Error("OCR isteği başarısız");
            }

            const data = await response.json();
            const expenses = data?.expenses ?? [];

            if (expenses.length === 0) {
                setUploadError("Fişte herhangi bir ürün/tutar tespit edilemedi. Lütfen daha net bir fotoğraf deneyin.");
                return;
            }

            setReviewExpenses(toEditableExpenses(expenses));
            setStep("review");
        } catch (error) {
            console.error("OCR isteği sırasında hata:", error);
            setUploadError("Fiş okunamadı. Lütfen daha net bir fotoğraf deneyin.");
        } finally {
            setIsUploading(false);
        }
    };

    const updateReviewField = (localId, field) => (event) => {
        const value = event.target.value;
        setReviewExpenses((prev) =>
            prev.map((expense) =>
                expense._localId === localId ? { ...expense, [field]: value } : expense
            )
        );
    };

    const removeReviewRow = (localId) => {
        setReviewExpenses((prev) => prev.filter((expense) => expense._localId !== localId));
    };

    const backToUpload = () => {
        setStep("upload");
        setSelectedFile(null);
        setReviewExpenses([]);
        setUploadError(null);
    };

    const handleSave = () => {
        onSaved(reviewExpenses);
        resetAndClose();
    };

    return (
        <div className="expense-entry-backdrop" onClick={resetAndClose}>
            <div className="expense-entry-modal" onClick={(event) => event.stopPropagation()}>

                <div className="expense-entry-header">
                    <h2>Gider Ekle</h2>
                    <button type="button" className="expense-entry-close" onClick={resetAndClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* ADIM 1: SEÇİM */}
                {step === "choose" && (
                    <div className="expense-entry-body">
                        <p className="expense-entry-subtitle">Nasıl gider eklemek istersiniz?</p>

                        <div className="expense-entry-choice-grid">
                            <button
                                type="button"
                                className="expense-entry-choice-card"
                                onClick={() => setStep("upload")}
                            >
                                <span className="material-symbols-outlined">receipt_long</span>
                                <span className="expense-entry-choice-title">Fiş / Fatura Yükle</span>
                                <span className="expense-entry-choice-desc">
                                    Fotoğraf veya PDF yükleyin, OCR otomatik okusun.
                                </span>
                            </button>

                            <button
                                type="button"
                                className="expense-entry-choice-card"
                                onClick={onManualAdd}
                            >
                                <span className="material-symbols-outlined">edit_note</span>
                                <span className="expense-entry-choice-title">Manuel Gider Ekle</span>
                                <span className="expense-entry-choice-desc">
                                    Gider bilgilerini formla elle girin.
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ADIM 2: DOSYA YÜKLEME */}
                {step === "upload" && (
                    <div className="expense-entry-body">
                        <p className="expense-entry-subtitle">
                            Fiş veya fatura fotoğrafı ya da PDF dosyası yükleyin.
                        </p>

                        <div
                            className={`expense-entry-dropzone ${isDragActive ? "active" : ""}`}
                            onDragOver={(event) => {
                                event.preventDefault();
                                setIsDragActive(true);
                            }}
                            onDragLeave={() => setIsDragActive(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <span className="material-symbols-outlined">upload_file</span>

                            {selectedFile ? (
                                <div className="expense-entry-file-chip">
                                    <span className="material-symbols-outlined">description</span>
                                    <span>{selectedFile.name}</span>
                                    <button
                                        type="button"
                                        className="expense-entry-file-remove"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedFile(null);
                                        }}
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p>Dosyayı sürükleyip bırakın ya da seçmek için tıklayın</p>
                                    <span className="expense-entry-dropzone-hint">JPG, JPEG, PNG veya PDF</span>
                                </>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                                hidden
                                onChange={(event) => handleFileChosen(event.target.files?.[0])}
                            />
                        </div>

                        {isUploading && (
                            <div className="expense-entry-loading">
                                <span className="expense-entry-spinner"></span>
                                Fiş okunuyor...
                            </div>
                        )}

                        {uploadError && <p className="expense-entry-error">{uploadError}</p>}
                    </div>
                )}

                {/* ADIM 3: SONUÇLARI GÖZDEN GEÇİR */}
                {step === "review" && (
                    <div className="expense-entry-body">
                        <p className="expense-entry-subtitle">
                            {reviewExpenses.length} kalem tespit edildi. Kaydetmeden önce kontrol edin.
                        </p>

                        <div className="expense-entry-review-list">
                            {reviewExpenses.map((expense) => (
                                <div className="expense-entry-review-card" key={expense._localId}>

                                    <div className="expense-entry-review-card-top">
                                        <input
                                            type="text"
                                            className="expense-entry-review-name"
                                            placeholder="Gider Adı"
                                            value={expense.name}
                                            onChange={updateReviewField(expense._localId, "name")}
                                        />
                                        <button
                                            type="button"
                                            className="expense-entry-review-remove"
                                            title="Bu satırı kaldır"
                                            onClick={() => removeReviewRow(expense._localId)}
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>

                                    <div className="expense-entry-review-grid">

                                        <div className="expense-field">
                                            <label>Kategori</label>
                                            <select
                                                value={expense.category}
                                                onChange={updateReviewField(expense._localId, "category")}
                                            >
                                                {OCR_EXPENSE_CATEGORIES.map((category) => (
                                                    <option value={category.value} key={category.value}>
                                                        {category.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="expense-field">
                                            <label>Miktar</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={expense.quantity}
                                                onChange={updateReviewField(expense._localId, "quantity")}
                                            />
                                        </div>

                                        <div className="expense-field">
                                            <label>Birim</label>
                                            <input
                                                type="text"
                                                placeholder="ADET, KG, LT..."
                                                value={expense.unit}
                                                onChange={updateReviewField(expense._localId, "unit")}
                                            />
                                        </div>

                                        <div className="expense-field">
                                            <label>Tutar</label>
                                            <div className="expense-amount-input">
                                                <span className="expense-currency-prefix">₺</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={expense.amount}
                                                    onChange={updateReviewField(expense._localId, "amount")}
                                                />
                                            </div>
                                        </div>

                                        <div className="expense-field">
                                            <label>Tarih</label>
                                            <input
                                                type="date"
                                                value={expense.date}
                                                onChange={updateReviewField(expense._localId, "date")}
                                            />
                                        </div>

                                        <div className="expense-field">
                                            <label>Ödeme Yöntemi</label>
                                            <select
                                                value={expense.paymentMethod}
                                                onChange={updateReviewField(expense._localId, "paymentMethod")}
                                            >
                                                <option value="">Seçiniz</option>
                                                {PAYMENT_METHODS.map((method) => (
                                                    <option value={method.value} key={method.value}>
                                                        {method.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                    </div>

                                    <div className="expense-field">
                                        <label>Açıklama</label>
                                        <input
                                            type="text"
                                            placeholder="Opsiyonel"
                                            value={expense.description}
                                            onChange={updateReviewField(expense._localId, "description")}
                                        />
                                    </div>

                                </div>
                            ))}

                            {reviewExpenses.length === 0 && (
                                <p className="expense-entry-review-empty">
                                    Tüm kalemler kaldırıldı. Kaydedecek bir şey kalmadı.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="expense-entry-footer">

                    {step === "choose" && (
                        <button type="button" className="expense-modal-cancel" onClick={resetAndClose}>
                            VAZGEÇ
                        </button>
                    )}

                    {step === "upload" && (
                        <>
                            <button type="button" className="expense-modal-cancel" onClick={() => setStep("choose")}>
                                GERİ
                            </button>
                            <button
                                type="button"
                                className="expense-modal-submit"
                                onClick={handleUpload}
                                disabled={isUploading}
                            >
                                {isUploading ? "OKUNUYOR..." : "FİŞİ OKU"}
                            </button>
                        </>
                    )}

                    {step === "review" && (
                        <>
                            <button type="button" className="expense-modal-cancel" onClick={backToUpload}>
                                GERİ
                            </button>
                            <button
                                type="button"
                                className="expense-modal-submit"
                                onClick={handleSave}
                                disabled={reviewExpenses.length === 0}
                            >
                                KAYDET
                            </button>
                        </>
                    )}

                </div>

            </div>
        </div>
    );
}

export default ExpenseEntryModal;
