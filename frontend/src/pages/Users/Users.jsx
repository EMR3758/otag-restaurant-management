import {useEffect, useMemo, useState} from "react";
import {data, useNavigate} from "react-router-dom";
import "./Users.css";
import Layout from "../../components/Layout";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

const ITEMS_PER_PAGE = 3;
const ROLE_OPTIONS = [
    "ADMIN",
    "MANAGER",
    "CHEF",
    "WAITER",
    "CUSTOMER"
]

const ROLE_LABELS = {
    ADMIN :"Admin",
    MANAGER :"Müdür",
    CHEF:"Chef",
    WAITER:"Garson",
    CUSTOMER:"Müşteri"
};

// Backend User için "active: true/false" alanı dönüyor;
// burada bunu ekranda gösterilecek "Aktif"/"Pasif" etiketine çeviriyoruz.
const STATUS_OPTIONS = ["Aktif", "Pasif"];

function getStatusLabel(user){
    const isActive = user.active ?? true;
    return isActive ? "Aktif" : "Pasif";
}

function getInitials(fullName){
    return fullName
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0,2);
}

function Users() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("ALL");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [userToDelete, setUserToDelete] = useState(null);

    // Personel ekle/düzenle/sil butonları sadece ADMIN ve MANAGER'a gösterilir.
    // Bu sadece arayüz görünürlüğüdür; asıl yetkilendirme backend'de yapılıyor,
    // bu yüzden burada rolü sadece localStorage'dan okumak yeterli.
    const currentUserRole = localStorage.getItem("role");
    const canManageUsers = currentUserRole === "ADMIN" || currentUserRole === "MANAGER";

    // MANAGER, ADMIN üzerinde hiçbir yönetim yetkisine sahip değil; bu yüzden
    // ADMIN kullanıcıları MANAGER'a listede hiç gösterilmiyor (sadece
    // düzenle/sil butonları gizlenmiyor, satırın kendisi de görünmüyor).
    // ADMIN için hiçbir filtreleme yapılmıyor, herkesi görüp yönetebiliyor.
    const isManager = currentUserRole === "MANAGER";

    // Bir satırdaki kullanıcı için düzenle/sil aksiyonlarının başlatılıp
    // başlatılamayacağını belirler. ADMIN herkesi yönetebilir; MANAGER,
    // ADMIN rolündeki bir kullanıcı üzerinde işlem başlatamaz. Backend zaten
    // bunu ayrıca reddediyor (asıl güvenlik orada); burada amaç MANAGER'ın
    // ADMIN için düzenle/sil isteğini backend'e hiç göndermemesini sağlamak.
    const canManageTargetUser = (user) => {
        if (currentUserRole === "ADMIN") {
            return true;
        }
        if (currentUserRole === "MANAGER") {
            return user.role !== "ADMIN";
        }
        return false;
    };

    function authHeaders(){
        return {
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:8080/users", {
            headers:authHeaders()
        }).then(response => response.json())
            .then(data => {
                setUsers(data);
            })
            .catch(error => {
                console.error("User Error:",error)
            });
    },[]);



    // MANAGER için ADMIN kullanıcılarını listeden tamamen çıkarıyoruz;
    // arama/rol/durum filtrelerinden önce uygulanıyor ki ADMIN hiçbir
    // şekilde (hiçbir filtre kombinasyonuyla) görünür olmasın.
    const visibleUsers = useMemo(() => {
        if (!isManager) {
            return users;
        }
        return users.filter((user) => user.role !== "ADMIN");
    }, [users, isManager]);

    const filteredUsers = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return visibleUsers.filter((user) => {
            const matchesSearch =
                term === "" ||
                user.fullName.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term);
            const matchesRole = selectedRole === "ALL" || user.role === selectedRole;
            const matchesStatus = selectedStatus === "ALL" || getStatusLabel(user) === selectedStatus;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [visibleUsers, searchTerm, selectedRole, selectedStatus]);



    const totalItems = filteredUsers.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);

    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const pageUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const rangeStart = totalItems === 0 ? 0 : startIndex + 1;
    const rangeEnd = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
        setCurrentPage(1);
    };

    const handleAddUser = () => {
        navigate("/users/add");
    };

    const handleEditUser = (user) => {
        // Buton zaten canManageTargetUser'a göre render edilmiyor; bu kontrol
        // MANAGER'ın ADMIN için düzenleme isteğini backend'e hiç göndermemesini
        // garanti eden ek bir önlem.
        if (!canManageTargetUser(user)) {
            return;
        }
        navigate(`/users/${user.id}/edit`);
    };

    const handleDeleteClick = (user) => {
        // Aynı önlem silme akışı için de geçerli.
        if (!canManageTargetUser(user)) {
            return;
        }
        setUserToDelete(user);
    };

    const handleCancelDelete = () => {
        setUserToDelete(null);
    };

    const handleConfirmDelete = async () => {

        if (!userToDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/users/${userToDelete.id}`,
                {
                    method: "DELETE",
                    headers: authHeaders()
                }
            );

            if (!response.ok) {
                throw new Error("Kullanıcı silinemedi");
            }

            setUsers((prev) =>
                prev.filter((user) => user.id !== userToDelete.id)
            );

        } catch (error) {
            console.error("Kullanıcı silinirken hata:", error);
            alert("Kullanıcı silinirken bir hata oluştu.");

        } finally {
            setUserToDelete(null);
        }
    };
    const goToPage = (page) => {
        setCurrentPage(Math.min(totalPages, Math.max(1, page)));
    };

    const goToPrevPage = () => {
        setCurrentPage((page) => Math.max(1, page - 1));
    };

    const goToNextPage = () => {
        setCurrentPage((page) => Math.min(totalPages, page + 1));
    };


    return (
        <Layout
            navbarType="tables"
            searchPlaceholder="Personel ara..."
        >

            <section className="users-page">
                <div className="users-header">
                    <div>
                        <h1>Personeller</h1>
                        <p>Personel hesaplarını ve erişim yetkilerini yönetin.</p>
                    </div>

                    {canManageUsers && (
                        <button type="button" className="add-user-button" onClick={handleAddUser}>
                            <span className="material-symbols-outlined">add</span>
                            Personel Ekle
                        </button>
                    )}
                </div>

                {/* =================================================
                    ARAÇ ÇUBUĞU
                ================================================= */}
                <div className="users-toolbar">

                    <div className="users-search">
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            placeholder="İsim veya e-posta ile personel ara..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            aria-label="Personel ara"
                        />
                    </div>

                    <div className="users-filters">

                        <div className="users-select-field">
                            <select
                                value={selectedRole}
                                onChange={handleRoleChange}
                                aria-label="Role göre filtrele"
                            >
                                <option value="ALL">Rol</option>
                                {Object.entries(ROLE_LABELS).map(([role,label])=>(
                                    <option value={role} key={role}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined">arrow_drop_down</span>
                        </div>

                        <div className="users-select-field">
                            <select
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                aria-label="Duruma göre filtrele"
                            >
                                <option value="ALL">Durum</option>
                                {STATUS_OPTIONS.map((status) => (
                                    <option value={status} key={status}>{status}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined">arrow_drop_down</span>
                        </div>

                    </div>

                </div>

                {/* =================================================
                    TABLO
                ================================================= */}
                <div className="users-table-card">

                    {pageUsers.length > 0 ? (
                        <div className="users-table-wrap">
                            <table className="users-table">
                                <thead>
                                <tr>
                                    <th>Ad Soyad</th>
                                    <th>E-posta</th>
                                    <th>Rol</th>
                                    <th>Durum</th>
                                    <th className="text-right">İşlemler</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pageUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar-badge">
                                                    {getInitials(user.fullName)}
                                                </div>
                                                <span className="user-full-name">{user.fullName}</span>
                                            </div>
                                        </td>

                                        <td className="user-email">{user.email}</td>

                                        <td className="user-role">{ROLE_LABELS[user.role] ?? user.role}</td>

                                        <td>
                                            <div className={`user-status ${getStatusLabel(user) === "Aktif" ? "status-active" : "status-inactive"}`}>
                                                <span className="status-dot" />
                                                {getStatusLabel(user)}
                                            </div>
                                        </td>

                                        <td className="text-right">
                                            {canManageTargetUser(user) && (
                                                <div className="user-row-actions">

                                                    <button
                                                        type="button"
                                                        className="action-button"
                                                        title="Personeli düzenle"
                                                        aria-label="Personeli düzenle"
                                                        onClick={() => handleEditUser(user)}
                                                    >
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="action-button action-button-delete"
                                                        title="Personeli sil"
                                                        aria-label="Personeli sil"
                                                        onClick={() => handleDeleteClick(user)}
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>

                                                </div>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                    ) : (

                        <div className="users-empty-state">
                            <span className="material-symbols-outlined">search_off</span>
                            <h3>Personel bulunamadı</h3>
                            <p>Arama veya filtrelerinizi değiştirmeyi deneyin.</p>
                        </div>

                    )}

                    {/* =================================================
                        SAYFALAMA
                    ================================================= */}
                    <div className="users-pagination">
                        <span>
                            {totalItems === 0
                                ? "0 personel"
                                : `${rangeStart} - ${rangeEnd} / ${totalItems} personel`}
                        </span>

                        <div className="pagination-controls">

                            <button
                                type="button"
                                className="pagination-arrow"
                                onClick={goToPrevPage}
                                disabled={safePage <= 1}
                                aria-label="Önceki sayfa"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button
                                    type="button"
                                    key={page}
                                    className={`pagination-page ${page === safePage ? "active" : ""}`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                type="button"
                                className="pagination-arrow"
                                onClick={goToNextPage}
                                disabled={safePage >= totalPages}
                                aria-label="Sonraki sayfa"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>

                        </div>

                    </div>

                </div>

            </section>

            <DeleteConfirmModal
                open={!!userToDelete}
                title="Personeli Sil"
                message={
                    userToDelete
                        ? `"${userToDelete.fullName}" adlı personeli silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
                        : ""
                }
                confirmLabel="Sil"
                cancelLabel="İptal"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

        </Layout>
    );
}

export default Users;
