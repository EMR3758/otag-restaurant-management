import { useEffect, useState } from "react";
import "./Tables.css";
import Layout from "../components/Layout";

function Tables() {

    const [tables, setTables] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("ALL");


    // =====================================================
    // MASALARI BACKEND'DEN ÇEK
    // =====================================================

    useEffect(() => {

        const token = localStorage.getItem("token");

        fetch("http://localhost:8080/tables", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {

                console.log("Tables:", data);

                setTables(data);

            })
            .catch(error => {

                console.error("Tables Error:", error);

            });

    }, []);


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
                                    {gardenTables.map(renderTable)}
                                </div>
                                {gardenTables.length > 5 && (
                                    <div className="section-footer">
                                        <button className="view-all-link">
                                            TÜMÜNÜ GÖR
                                            <span className="material-symbols-outlined">chevron_right</span>
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
                                    {salonOkeyTables.map(renderTable)}
                                </div>
                                {salonOkeyTables.length > 5 && (
                                    <div className="section-footer">
                                        <button className="view-all-link">
                                            TÜMÜNÜ GÖR
                                            <span className="material-symbols-outlined">chevron_right</span>
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
                                    {gardenOkeyTables.map(renderTable)}
                                </div>
                                {gardenOkeyTables.length > 5 && (
                                    <div className="section-footer">
                                        <button className="view-all-link">
                                            TÜMÜNÜ GÖR
                                            <span className="material-symbols-outlined">chevron_right</span>
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

                                {gardenTables.map(renderTable)}

                            </div>

                            {gardenTables.length > 5 && (
                                <div className="section-footer">
                                    <button className="view-all-link">
                                        TÜMÜNÜ GÖR
                                        <span className="material-symbols-outlined">chevron_right</span>
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

                                {salonOkeyTables.map(renderTable)}

                            </div>

                            {salonOkeyTables.length > 5 && (
                                <div className="section-footer">
                                    <button className="view-all-link">
                                        TÜMÜNÜ GÖR
                                        <span className="material-symbols-outlined">chevron_right</span>
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

                                {gardenOkeyTables.map(renderTable)}

                            </div>

                            {gardenOkeyTables.length > 5 && (
                                <div className="section-footer">
                                    <button className="view-all-link">
                                        TÜMÜNÜ GÖR
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            )}

                        </div>

                    )}

            </section>

        </Layout>
    );
}

export default Tables;