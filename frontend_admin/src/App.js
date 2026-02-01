import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


/* ===== ADMIN ===== */
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminPrivateRoute from "./admin/AdminPrivateRoute";

/* ===== ADMIN PAGES ===== */
import Dashboard from "./admin/pages/Dashboards";
import ProductManagement from "./admin/pages/ProductManagement";
import ProductCreate from "./admin/pages/ProductCreate";
import ProductEdit from "./admin/pages/ProductEdit";
import UserManagement from "./admin/pages/UserManagement";
import OrderManagement from "./admin/pages/OrderManagement";
import Voucher from "./admin/pages/Voucher";
import StoreManagement from "./admin/pages/StoreManagement";
import InventoryManagement from "./admin/pages/InventoryManagement";
import CategoryManagement from "./admin/pages/CategoryManagement";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />

        {/* ADMIN (PROTECTED) */}
        <Route
          path="/admin"
          element={
            <AdminPrivateRoute>
              <AdminLayout />
            </AdminPrivateRoute>
          }
        >
          {/* ✅ FIX: route mặc định */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="category" element={<CategoryManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="stores" element={<StoreManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="vouchers" element={<Voucher />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
