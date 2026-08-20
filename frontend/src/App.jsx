import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationsProvider } from "./context/NotificationsContext";

import Home from "./site/pages/Home";
import FullMenu from "./site/pages/FullMenu";
import Reservation from "./site/pages/Reservation";
import About from "./site/pages/About";
import Contact from "./site/pages/Contact";
import Cart from "./site/pages/Cart";
import Account from "./site/pages/Account";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Tables from "./pages/Tables/Tables.jsx";
import AddTables from "./pages/Tables/AddTables.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import CreateOrder from "./pages/Products/CreateOrder.jsx";
import OrderDetail from "./pages/Orders/OrderDetail.jsx";
import Menu from "./pages/Menu/Menu.jsx";
import AddProduct from "./pages/Products/AddProduct.jsx";
import Categories from "./pages/Categories/Categories.jsx";
import AddCategory from "./pages/Categories/AddCategory.jsx";
import Users from "./pages/Users/Users.jsx";
import AddUser from "./pages/Users/AddUser.jsx";
import EditUser from "./pages/Users/EditUser.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import Notifications from "./pages/Notifications";
import Reservations from "./pages/Reservations/Reservation.jsx";
import Stock from "./pages/Stock/Stock.jsx";

function App() {
    return (
        <BrowserRouter>

            <NotificationsProvider>

                <Routes>

                    {/* =========================================
                        MÜŞTERİ WEB SİTESİ (public, Otağ Cafe)
                    ========================================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/full-menu"
                        element={<FullMenu />}
                    />

                    <Route
                        path="/reservation"
                        element={<Reservation />}
                    />

                    <Route
                        path="/about"
                        element={<About />}
                    />

                    <Route
                        path="/contact"
                        element={<Contact />}
                    />

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/account"
                        element={<Account />}
                    />

                    {/* =========================================
                        ADMIN PANELİ
                    ========================================= */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/tables"
                        element={<Tables />}
                    />

                    <Route
                        path="/tables/add"
                        element={<AddTables />}
                    />

                    <Route
                        path="/orders"
                        element={<Orders />}
                    />

                    <Route
                        path="/orders/create"
                        element={<CreateOrder />}
                    />

                    <Route
                        path="/orders/:id"
                        element={<OrderDetail />}
                    />

                    <Route
                        path="/menu"
                        element={<Menu />}
                    />

                    <Route
                        path="/menu/add"
                        element={<AddProduct />}
                    />

                    <Route
                        path="/menu/:id/edit"
                        element={<AddProduct />}
                    />

                    <Route
                        path="/categories"
                        element={<Categories />}
                    />

                    <Route
                        path="/categories/add"
                        element={<AddCategory />}
                    />

                    <Route
                        path="/categories/:id/edit"
                        element={<AddCategory />}
                    />

                    <Route
                        path="/reservations"
                        element={<Reservations />}
                    />

                    <Route
                        path="/stock"
                        element={<Stock />}
                    />

                    <Route
                        path="/users"
                        element={<Users />}
                    />

                    <Route
                        path="/users/add"
                        element={<AddUser />}
                    />

                    <Route
                        path="/users/:id/edit"
                        element={<EditUser />}
                    />

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                    <Route
                        path="/notifications"
                        element={<Notifications />}
                    />

                </Routes>

            </NotificationsProvider>

        </BrowserRouter>
    );
}

export default App;
