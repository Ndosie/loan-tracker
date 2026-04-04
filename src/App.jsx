import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Loans from "./pages/Loans";
import LoanDetails from "./pages/LoanDetails";
import AddLoan from "./pages/AddLoan";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AddCustomer from "./pages/AddCustomer";
import EditCustomer from "./pages/EditCustomer";
import EditLoan from "./pages/EditLoan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <Customers />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/new"
          element={
            <ProtectedRoute>
              <Layout>
                <AddCustomer />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditCustomer />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/loans"
          element={
            <ProtectedRoute>
              <Layout>
                <Loans />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <LoanDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans/new"
          element={
            <ProtectedRoute>
              <Layout>
                <AddLoan />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/loans/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditLoan />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminPanel />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
