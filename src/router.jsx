import { createBrowserRouter } from "react-router-dom";
import AdminPanel, { loader as actionsLoader } from "./pages/AdminPanel";
import Users, { loader as usersLoader } from "./pages/Users";
import Dashboard, { loader as dashboardLoader } from "./pages/Dashboard";
import Customers, {
  loader as customersLoader,
  action as deleteCustomerAction,
} from "./pages/Customers";
import Loans, {
  loader as loansLoader,
  action as deleteLoanAction,
} from "./pages/Loans";
import LoanDetails, {
  loader as loanDetailsLoader,
  action as loanDetailsAction,
} from "./pages/LoanDetails";
import AddLoan, {
  loader as addLoadLoader,
  action as addLoanAction,
} from "./pages/AddLoan";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AddCustomer, { action as addCustomerAction } from "./pages/AddCustomer";
import EditCustomer, {
  loader as editCustomerLoader,
  action as editCustomerAction,
} from "./pages/EditCustomer";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Dashboard />,
            loader: dashboardLoader,
          },
          {
            path: "customers",
            element: <Customers />,
            loader: customersLoader,
          },
          {
            path: "customers/new",
            element: <AddCustomer />,
            action: addCustomerAction,
          },
          {
            path: "customers/:customerId/edit",
            element: <EditCustomer />,
            loader: editCustomerLoader,
            action: editCustomerAction,
          },
          {
            path: "customers/delete",
            action: deleteCustomerAction,
          },
          {
            path: "loans",
            element: <Loans />,
            loader: loansLoader,
          },
          {
            path: "loans/new",
            element: <AddLoan />,
            loader: addLoadLoader,
            action: addLoanAction,
          },
          {
            path: "loans/:loanId",
            element: <LoanDetails />,
            loader: loanDetailsLoader,
            action: loanDetailsAction,
          },
          {
            path: "loans/delete",
            action: deleteLoanAction,
          },
          {
            path: "admin",
            element: <AdminPanel />,
            loader: actionsLoader,
          },
          {
            path: "admin/users",
            element: <Users />,
            loader: usersLoader,
          },
        ],
      },
    ],
  },
]);

export default router;
