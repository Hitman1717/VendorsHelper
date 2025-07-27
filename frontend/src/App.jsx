import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import all pages and the layout
import LoginComponent from "./pages/LoginComponent";
import SignupComponent from "./pages/SignupComponent";
// Import the layout
import DashboardLayout from "./pages/DashboardLayout";
import Home from "./components/Home";
import MainContent from "./components/OrderReceived";
import PendingOrders from "./components/PendingOrders";
import ProductManagement from "./components/ProductManagement";

import EditProduct from './components/EditProduct';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone routes without the dashboard layout */}
        <Route path="/signin" element={<LoginComponent />} />
        <Route path="/signup" element={<SignupComponent />} />

        {/* This "Layout Route" wraps all its children with the DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/dashboard/orders-received" element={<MainContent />} />
          <Route path="/dashboard/pending-orders" element={<PendingOrders />} />
          <Route path="/dashboard/products" element={<ProductManagement />} />
          <Route path="/dashboard/products/edit/:productId" element={<EditProduct />} />
        </Route>

        {/* Redirect users from the root URL to the sign-in page */}
        <Route path="/" element={<Navigate to="/signin" />} />

        {/* Catch-all 404 page */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
