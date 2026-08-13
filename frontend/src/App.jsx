import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tables from "./pages/Tables";
import Orders from "./pages/Orders";
import CreateOrder from "./pages/CreateOrder";

function App() {
    return (
        <BrowserRouter>

            <Routes>

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
                    path="/orders"
                    element={<Orders />}
                />

                <Route
                    path="/orders/create"
                    element={<CreateOrder />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;