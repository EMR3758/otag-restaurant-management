import { useMemo, useState } from "react";
import "./SplitItemModal.css";

const SPLIT_TABS = [
    { key: "EQUAL", label: "Eşit Böl" },
    { key: "BY_QUANTITY", label: "Adet Bazlı" },
    { key: "MANUAL", label: "Manuel Tutar" }
];

function formatCurrency(amount) {
    if (amount == null || Number.isNaN(amount)) {
        return "₺0,00";
    }
    return `₺${Number(amount).toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Ürünün daha önceden kaydedilmiş bölüştürmesi varsa, modal aynı
// sekme ve değerlerle açılsın diye başlangıç state'ini oradan kurar.
function resolveInitialTab(existingAllocations) {
    if (existingAllocations.length > 0 && existingAllocations[0].splitType) {
        return existingAllocations[0].splitType;
    }
    return "EQUAL";
}

// item: { id, productName, unitPrice, quantity, subtotal }
// participants: [{ id, name }]
// existingAllocations: [{ participantId, participantName, amount, quantity, splitType }]
function SplitItemModal({ item, participants, existingAllocations, onCancel, onSave }) {

    const [activeTab, setActiveTab] = useState(() => resolveInitialTab(existingAllocations));

    const [selectedIds, setSelectedIds] = useState(() => {
        if (resolveInitialTab(existingAllocations) === "EQUAL") {
            return new Set(existingAllocations.map((a) => a.participantId));
        }
        return new Set();
    });

    const [quantities, setQuantities] = useState(() => {
        const map = {};
        existingAllocations.forEach((a) => {
            map[a.participantId] = a.quantity ?? 0;
        });
        return map;
    });

    const [amounts, setAmounts] = useState(() => {
        const map = {};
        existingAllocations.forEach((a) => {
            map[a.participantId] = a.amount ?? 0;
        });
        return map;
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const subtotal = item.subtotal ?? (item.unitPrice ?? 0) * (item.quantity ?? 0);

    const distributed = useMemo(() => {
        if (activeTab === "EQUAL") {
            return selectedIds.size > 0 ? subtotal : 0;
        }
        if (activeTab === "BY_QUANTITY") {
            return participants.reduce(
                (sum, p) => sum + (Number(quantities[p.id]) || 0) * (item.unitPrice ?? 0),
                0
            );
        }
        return participants.reduce((sum, p) => sum + (Number(amounts[p.id]) || 0), 0);
    }, [activeTab, selectedIds, quantities, amounts, participants, subtotal, item.unitPrice]);

    const remaining = Math.round((subtotal - distributed) * 100) / 100;

    const totalQuantityAssigned = useMemo(() => {
        return participants.reduce((sum, p) => sum + (Number(quantities[p.id]) || 0), 0);
    }, [participants, quantities]);

    const toggleSelected = (participantId) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(participantId)) {
                next.delete(participantId);
            } else {
                next.add(participantId);
            }
            return next;
        });
    };

    const handleQuantityChange = (participantId, value) => {
        const qty = Math.max(0, Math.floor(Number(value) || 0));
        setQuantities((prev) => ({ ...prev, [participantId]: qty }));
    };

    const handleAmountChange = (participantId, value) => {
        const amount = Math.max(0, Number(value) || 0);
        setAmounts((prev) => ({ ...prev, [participantId]: amount }));
    };

    const canSave =
        !isSaving &&
        remaining >= 0 &&
        (
            (activeTab === "EQUAL" && selectedIds.size > 0) ||
            (activeTab === "BY_QUANTITY" && totalQuantityAssigned > 0 && totalQuantityAssigned <= (item.quantity ?? 0)) ||
            (activeTab === "MANUAL" && distributed > 0)
        );

    const handleSave = async () => {
        if (!canSave) {
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            let entries = [];
            if (activeTab === "EQUAL") {
                entries = Array.from(selectedIds).map((participantId) => ({ participantId }));
            } else if (activeTab === "BY_QUANTITY") {
                entries = participants
                    .filter((p) => (Number(quantities[p.id]) || 0) > 0)
                    .map((p) => ({ participantId: p.id, quantity: Number(quantities[p.id]) || 0 }));
            } else {
                entries = participants
                    .filter((p) => (Number(amounts[p.id]) || 0) > 0)
                    .map((p) => ({ participantId: p.id, amount: Number(amounts[p.id]) || 0 }));
            }
            await onSave(activeTab, entries);
        } catch (saveError) {
            console.error("Bölüştürme kaydedilirken hata:", saveError);
            setError(saveError.message || "Bölüştürme kaydedilemedi.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="split-modal-backdrop" onClick={onCancel}>
            <div className="split-modal" onClick={(event) => event.stopPropagation()}>

                <div className="split-modal-header">
                    <h3>{item.productName} — {formatCurrency(subtotal)}</h3>
                    <button type="button" className="split-modal-close" onClick={onCancel}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="split-modal-tabs">
                    {SPLIT_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            className={activeTab === tab.key ? "active" : ""}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {participants.length === 0 ? (
                    <p className="split-modal-empty">Önce en az bir kişi eklemelisiniz.</p>
                ) : (
                    <div className="split-modal-participants">
                        {participants.map((participant) => (
                            <div className="split-modal-row" key={participant.id}>

                                {activeTab === "EQUAL" && (
                                    <>
                                        <label className="split-modal-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(participant.id)}
                                                onChange={() => toggleSelected(participant.id)}
                                            />
                                            {participant.name}
                                        </label>
                                        <span className="split-modal-amount">
                                            {selectedIds.has(participant.id)
                                                ? formatCurrency(subtotal / Math.max(selectedIds.size, 1))
                                                : formatCurrency(0)}
                                        </span>
                                    </>
                                )}

                                {activeTab === "BY_QUANTITY" && (
                                    <>
                                        <span className="split-modal-name">{participant.name}</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max={item.quantity ?? 0}
                                            value={quantities[participant.id] ?? 0}
                                            onChange={(event) => handleQuantityChange(participant.id, event.target.value)}
                                        />
                                        <span className="split-modal-amount">
                                            {formatCurrency((Number(quantities[participant.id]) || 0) * (item.unitPrice ?? 0))}
                                        </span>
                                    </>
                                )}

                                {activeTab === "MANUAL" && (
                                    <>
                                        <span className="split-modal-name">{participant.name}</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={amounts[participant.id] ?? 0}
                                            onChange={(event) => handleAmountChange(participant.id, event.target.value)}
                                        />
                                    </>
                                )}

                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "BY_QUANTITY" && (
                    <p className="split-modal-note">
                        Dağıtılan adet: {totalQuantityAssigned} / {item.quantity ?? 0}
                    </p>
                )}

                <div className="split-modal-totals">
                    <div>
                        <span>Ürün Toplamı</span>
                        <strong>{formatCurrency(subtotal)}</strong>
                    </div>
                    <div>
                        <span>Dağıtılan</span>
                        <strong>{formatCurrency(distributed)}</strong>
                    </div>
                    <div>
                        <span>Kalan</span>
                        <strong className={remaining < 0 ? "negative" : ""}>{formatCurrency(remaining)}</strong>
                    </div>
                </div>

                {error && <p className="split-modal-error">{error}</p>}

                <div className="split-modal-actions">
                    <button type="button" className="split-modal-cancel" onClick={onCancel} disabled={isSaving}>
                        İptal
                    </button>
                    <button type="button" className="split-modal-save" onClick={handleSave} disabled={!canSave}>
                        {isSaving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default SplitItemModal;
