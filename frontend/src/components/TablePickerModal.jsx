import { useEffect, useState } from "react";
import "./TablePickerModal.css";

// Paylaşılan masa seçim/gösterim modalı.
// CreateOrder.jsx (seçilebilir) ve Dashboard.jsx (salt görüntüleme) tarafından
// ortak kullanılır — 45 masa hiçbir zaman sayfanın ana layout'una basılmaz.
//
// Doluluk doğrudan backend'in RestaurantTableDTO.available alanından okunur.

const LOCATION_FILTERS = [
    { value: "ALL", label: "Tümü" },
    { value: "BAHCE", label: "Bahçe" },
    { value: "SALON", label: "Salon" },
    { value: "OKEY", label: "Okey" }
];

function matchesLocationFilter(table, filter) {

    if (filter === "ALL") {
        return true;
    }

    if (filter === "OKEY") {
        return table.tableType === "OKEY";
    }

    return table.location === filter;

}


function TablePickerModal({
    open,
    onClose,
    tables = [],
    selectedTableId = null,
    onSelect,
    title = "Masa Seç"
}) {

    const [locationFilter, setLocationFilter] = useState("ALL");

    useEffect(() => {

        if (!open) {
            return;
        }

        // Modal her açıldığında filtreyi sıfırlıyoruz.
        setLocationFilter("ALL");

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };

    }, [open, onClose]);


    if (!open) {
        return null;
    }

    const visibleTables = tables.filter((table) =>
        matchesLocationFilter(table, locationFilter)
    );

    return (

        <div className="table-picker-backdrop" onClick={onClose}>

            <div
                className="table-picker-modal"
                onClick={(event) => event.stopPropagation()}
            >

                <div className="table-picker-header">

                    <h2>{title}</h2>

                    <button
                        type="button"
                        className="table-picker-close"
                        onClick={onClose}
                        aria-label="Kapat"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>

                </div>

                <div className="table-picker-filters">

                    {LOCATION_FILTERS.map((filter) => (
                        <button
                            key={filter.value}
                            type="button"
                            className={`table-picker-filter ${
                                locationFilter === filter.value ? "active" : ""
                            }`}
                            onClick={() => setLocationFilter(filter.value)}
                        >
                            {filter.label}
                        </button>
                    ))}

                </div>

                <div className="table-picker-body">

                    <div className="table-picker-grid">

                        {visibleTables.map((table) => {

                            const isSelected = table.id === selectedTableId;
                            const isOccupied = !table.available;

                            return (

                                <button
                                    key={table.id}
                                    type="button"
                                    className={`table-picker-card ${
                                        isSelected ? "selected" : ""
                                    } ${isOccupied ? "occupied" : ""}`}
                                    disabled={isOccupied}
                                    onClick={() => onSelect && onSelect(table)}
                                >

                                    {table.tableType === "OKEY" && (
                                        <span className="table-picker-type">OKEY</span>
                                    )}

                                    <span className="table-picker-number">
                                        {table.tableNumber}
                                    </span>

                                    <span className="table-picker-capacity">
                                        {table.capacity} Kişilik
                                    </span>

                                    <span className="table-picker-status">
                                        <span className="status-dot"></span>
                                        {isSelected
                                            ? "Seçili"
                                            : isOccupied
                                                ? "Dolu"
                                                : "Müsait"}
                                    </span>

                                </button>

                            );

                        })}

                        {visibleTables.length === 0 && (
                            <p className="table-picker-empty">
                                Bu filtreyle eşleşen masa bulunamadı.
                            </p>
                        )}

                    </div>

                </div>

                <div className="table-picker-legend">

                    <span className="legend-item">
                        <span className="status-dot legend-dot-available"></span>
                        Müsait
                    </span>

                    <span className="legend-item">
                        <span className="status-dot legend-dot-occupied"></span>
                        Dolu
                    </span>

                </div>

            </div>

        </div>

    );

}

export default TablePickerModal;
