import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Tables.css";
import Layout from "../../components/Layout.jsx";
import DeleteConfirmModal from "../../components/DeleteConfirmModal.jsx";

function Tables() {

    const navigate = useNavigate();

    const [tables, setTables] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("ALL");

    // Her kategori ilk açıldığında sadece bu kadar masa gösterilir.
    const TABLE_PREVIEW_LIMIT = 10;

    // Hangi kategorinin "TÜMÜNÜ GÖR" ile açıldığını, kategoriler
    // birbirinden bağımsız olacak şekilde tutuyoruz.
    const [expandedCategories, setExpandedCategories] = useState({
        GARDEN: false,
        SALON_OKEY: false,
        GARDEN_OKEY: false
    });

    const toggleCategoryExpanded = (categoryKey) => {
        setExpandedCategories((previous) => ({
            ...previous,
            [categoryKey]: !previous[categoryKey]
        }));
    };

    // Bir kategori açık değilse ilk TABLE_PREVIEW_LIMIT masayı,
    // açıksa kategorideki bütün masaları döndürür.
    const getVisibleTables = (categoryKey, categoryTables) =>
        expandedCategories[categoryKey]
            ? categoryTables
            : categoryTables.slice(0, TABLE_PREVIEW_LIMIT);

    // "Masayı Boşalt" onay akışı için.
    const [tableToFree, setTableToFree] = useState(null);
    const [isFreeingTable, setIsFreeingTable] = useState(false);


    // =====================================================
    // MASALARI BACKEND'DEN ÇEK
    // =====================================================

    const fetchTables = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/tables", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        console.log("Tables:", data);

        setTables(data);

        return data;

    };

    useEffect(() => {

        fetchTables().catch((error) => {
            console.error("Tables Error:", error);
        });

    }, []);


    // =====================================================
    // YENİ MASA EKLE
    // =====================================================
    const handleAddTable = () => {
        navigate("/tables/add");
    };


    // =====================================================
    // MASAYI BOŞALT
    // =====================================================
    const handleFreeTableClick = (table) => {
        setTableToFree(table);
    };

    const handleCancelFreeTable = () => {
        setTableToFree(null);
    };

    const handleConfirmFreeTable = async () => {

        if (!tableToFree) {
            return;
        }

        setIsFreeingTable(true);

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/tables/${tableToFree.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        tableNumber: tableToFree.tableNumber,
                        capacity: tableToFree.capacity,
                        tableType: tableToFree.tableType,
                        location: tableToFree.location,
                        available: true
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Masa güncellenemedi");
            }

            const freshTables = await fetchTables();

            const stillOccupied = freshTables.find(
                (table) => table.id === tableToFree.id
            )?.available === false;

            if (stillOccupied) {
                alert(
                    "Masa backend'de hâlâ \"Dolu\" görünüyor. " +
                    "Bu özellik şu an backend tarafından desteklenmiyor: " +
                    "PUT /tables/{id} endpoint'inin \"available\" alanını " +
                    "kabul edip kaydetmesi gerekiyor."
                );
            }

        } catch (error) {

            console.error("Masa boşaltılırken hata:", error);
            alert("Masa boşaltılırken bir hata oluştu.");

        } finally {

            setIsFreeingTable(false);
            setTableToFree(null);

        }

    };


    const gardenTables = tables.filter(table =>
        table.location === "BAHCE" &&
        table.tableType === "NORMAL"
    );


    const salonOkeyTables = tables.filter(table =>
        table.location === "SALON" &&
        table.tableType === "OKEY"
    );

    const gardenOkeyTables = tables.filter(table =>
        table.location === "BAHCE" &&
        table.tableType === "OKEY"
    );


    const totalTables = tables.length;

    const availableTables = tables.filter(table =>
        table.available === true
    ).length;

    const occupiedTables = tables.filter(table =>
        table.available === false
    ).length;


    // =====================================================
    // MASA KARTI
    // =====================================================

    const renderTable = (table) => (

        <div
            className={`table-card ${
                table.available ? "available" : "occupied"
            }`}
            key={table.id}
        >

            {table.tableType === "OKEY" && (
                <span className="table-type">
                    OKEY
                </span>
            )}

            <div className="table-card-header">

                <h3>
                    {table.tableNumber}
                </h3>

                <span
                    className={`material-symbols-outlined table-status-icon ${
                        table.available ? "" : "filled"
                    }`}
                >
                    {table.available ? "check_circle" : "restaurant"}
                </span>

            </div>

            <p className="capacity">
                <span className="material-symbols-outlined">group</span>
                {table.capacity} KİŞİLİK
            </p>

            <div
                className={`table-status ${
                    table.available
                        ? "status-available"
                        : "status-occupied"
                }`}
            >
                {table.available ? "Müsait" : "Dolu"}
            </div>

            {!table.available && (
                <button
                    type="button"
                    className="free-table-button"
                    onClick={(event) => {
                        event.stopPropagation();
                        handleFreeTableClick(table);
                    }}
                >
                    Masayı Boşalt
                </button>
            )}

        </div>

    );
    return (
        <Layout
            navbarType="tables"
            searchPlaceholder="Masa ara..."
        >

            <section className="tables-page">
                    <div className="tables-header">
                        <div>
                            <h1>Masalar</h1>
                            <p>Restoran masa durumlarını görüntüleyin ve yönetin.</p>
                        </div>

                        <div className="table-stats">
                            <div className="stat-card">
                                <span className="stat-label">TOPLAM</span>
                                <strong className="stat-value">{totalTables}</strong>
                            </div>


                            <div className="stat-card available-stat">
                                <span className="stat-label">
                                    <span className="status-dot dot-available"></span>
                                    MÜSAİT
                                </span>
                                <strong className="stat-value">{availableTables}</strong>
                            </div>


                            <div className="stat-card occupied-stat">
                                <span className="stat-label">
                                    <span className="status-dot dot-occupied"></span>
                                    DOLU
                                </span>
                                <strong className="stat-value">{occupiedTables}</strong>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="add-table-button"
                            onClick={handleAddTable}
                        >
                            <span className="material-symbols-outlined">add</span>
                            Yeni Masa Ekle
                        </button>
                    </div>


                    <div className="filter-buttons">

                        <button
                            className={selectedFilter === "ALL" ? "active" : ""}
                            onClick={() => setSelectedFilter("ALL")}
                        >Tümü</button>

                        <button className={selectedFilter === "GARDEN" ? "active" : ""}
                                onClick={() => setSelectedFilter("GARDEN")}
                        >Bahçe</button>

                        <button
                            className={selectedFilter === "SALON_OKEY" ? "active" : ""}
                            onClick={() => setSelectedFilter("SALON_OKEY")}
                        >Salon Okey</button>

                        <button
                            className={selectedFilter === "GARDEN_OKEY" ? "active" : ""}
                            onClick={() => setSelectedFilter("GARDEN_OKEY")}
                        >Bahçe Okey</button>

                    </div>

                    {selectedFilter === "ALL" && (

                        <>
                            <div className="table-section">
                                <div className="section-title">
                                    <span className="material-symbols-outlined section-icon">park</span>
                                    <h2>Bahçe Masaları</h2>

                                </div>
                                <div className="table-grid">
                                    {getVisibleTables("GARDEN", gardenTables).map(renderTable)}
                                </div>
                                {gardenTables.length > TABLE_PREVIEW_LIMIT && (
                                    <div className="section-footer">
                                        <button
                                            type="button"
                                            className="view-all-link"
                                            onClick={() => toggleCategoryExpanded("GARDEN")}
                                        >
                                            {expandedCategories.GARDEN ? "DAHA AZ GÖR" : "TÜMÜNÜ GÖR"}
                                            <span className="material-symbols-outlined">
                                                {expandedCategories.GARDEN ? "expand_less" : "chevron_right"}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>


                            <div className="table-section">
                                <div className="section-title">
                                    <span className="material-symbols-outlined section-icon">meeting_room</span>
                                    <h2>Kapalı Salon Okey</h2>
                                </div>

                                <div className="table-grid">
                                    {getVisibleTables("SALON_OKEY", salonOkeyTables).map(renderTable)}
                                </div>
                                {salonOkeyTables.length > TABLE_PREVIEW_LIMIT && (
                                    <div className="section-footer">
                                        <button
                                            type="button"
                                            className="view-all-link"
                                            onClick={() => toggleCategoryExpanded("SALON_OKEY")}
                                        >
                                            {expandedCategories.SALON_OKEY ? "DAHA AZ GÖR" : "TÜMÜNÜ GÖR"}
                                            <span className="material-symbols-outlined">
                                                {expandedCategories.SALON_OKEY ? "expand_less" : "chevron_right"}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="table-section">
                                <div className="section-title">
                                    <span className="material-symbols-outlined section-icon">deck</span>
                                    <h2>Bahçe Okey</h2>
                                </div>
                                <div className="table-grid">
                                    {getVisibleTables("GARDEN_OKEY", gardenOkeyTables).map(renderTable)}
                                </div>
                                {gardenOkeyTables.length > TABLE_PREVIEW_LIMIT && (
                                    <div className="section-footer">
                                        <button
                                            type="button"
                                            className="view-all-link"
                                            onClick={() => toggleCategoryExpanded("GARDEN_OKEY")}
                                        >
                                            {expandedCategories.GARDEN_OKEY ? "DAHA AZ GÖR" : "TÜMÜNÜ GÖR"}
                                            <span className="material-symbols-outlined">
                                                {expandedCategories.GARDEN_OKEY ? "expand_less" : "chevron_right"}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>

                        </>

                    )}


                    {/* =====================================================
                SADECE BAHÇE
            ===================================================== */}

                    {selectedFilter === "GARDEN" && (

                        <div className="table-section">

                            <div className="section-title">

                        <span className="material-symbols-outlined section-icon">
                            park
                        </span>

                                <h2>
                                    Bahçe Masaları
                                </h2>

                            </div>

                            <div className="table-grid">

                                {getVisibleTables("GARDEN", gardenTables).map(renderTable)}

                            </div>

                            {gardenTables.length > TABLE_PREVIEW_LIMIT && (
                                <div className="section-footer">
                                    <button
                                        type="button"
                                        className="view-all-link"
                                        onClick={() => toggleCategoryExpanded("GARDEN")}
                                    >
                                        {expandedCategories.GARDEN ? "DAHA AZ GÖR" : "TÜMÜNÜ GÖR"}
                                        <span className="material-symbols-outlined">
                                            {expandedCategories.GARDEN ? "expand_less" : "chevron_right"}
                                        </span>
                                    </button>
                                </div>
                            )}

                        </div>

                    )}


                    {/* =====================================================
                SADECE SALON OKEY
            ===================================================== */}

                    {selectedFilter === "SALON_OKEY" && (

                        <div className="table-section">

                            <div className="section-title">

                        <span className="material-symbols-outlined section-icon">
                            meeting_room
                        </span>

                                <h2>
                                    Kapalı Salon Okey
                                </h2>

                            </div>

                            <div className="table-grid">

                                {getVisibleTables("SALON_OKEY", salonOkeyTables).map(renderTable)}

                            </div>

                            {salonOkeyTables.length > TABLE_PREVIEW_LIMIT && (
                                <div className="section-footer">
                                    <button
                                        type="button"
                                        className="view-all-link"
                                        onClick={() => toggleCategoryExpanded("SALON_OKEY")}
                                    >
                                        {expandedCategories.SALON_OKEY ? "DAHA AZ GÖR" : "TÜMÜNÜ GÖR"}
                                        <span className="material-symbols-outlined">
                                            {expandedCategories.SALON_OKEY ? "expand_less" : "chevron_right"}
                                        </span>
                                    </button>
                                </div>
                            )}

                        </div>

                    )}


                    {/* =====================================================
                SADECE BAHÇE OKEY
            ===================================================== */}

                    {selectedFilter === "GARDEN_OKEY" && (

                        <div className="table-section">

                            <div className="section-title">

                        <span className="material-symbols-outlined section-icon">
                            deck
                        </span>

                                <h2>
                                    Bahçe Okey
                                </h2>

                            </div>

                            <div className="table-grid">

                                {getVisibleTables("GARDEN_OKEY", gardenOkeyTables).map(renderTable)}

                            </div>

                            {gardenOkeyTables.length > TABLE_PREVIEW_LIMIT && (
                                <div className="section-footer">
                                    <button
                                        type="button"
                                        className="view-all-link"
                                        onClick={() => toggleCategoryExpanded("GARDEN_OKEY")}
                                    >
                                        {expandedCategories.GARDEN_OKEY ? "DAHA AZ GÖR" : "TÜMÜNÜ GÖR"}
                                        <span className="material-symbols-outlined">
                                            {expandedCategories.GARDEN_OKEY ? "expand_less" : "chevron_right"}
                                        </span>
                                    </button>
                                </div>
                            )}

                        </div>

                    )}

            </section>

            <DeleteConfirmModal
                open={!!tableToFree}
                variant="neutral"
                title={tableToFree ? `Masa ${tableToFree.tableNumber}'yi Boşalt?` : ""}
                message={
                    tableToFree
                        ? `Masa ${tableToFree.tableNumber}'yi boşaltmak istediğinize emin misiniz?`
                        : ""
                }
                confirmLabel="Masayı Boşalt"
                isConfirming={isFreeingTable}
                onConfirm={handleConfirmFreeTable}
                onCancel={handleCancelFreeTable}
            />

        </Layout>
    );
}

export default Tables;