import { Link } from "react-router-dom";
import { logout } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, profile } = useAuth();

  const linkClass = (path) =>
    `px-3 py-1 rounded-lg transition ${
      location.pathname === path
        ? "bg-blue-100 text-blue-600"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div>
          <h1 className="text-lg font-bold text-blue-600 leading-tight">
            Mic Finance Limited
          </h1>
          <p className="text-xs text-gray-500">Loan Tracker System</p>
        </div>
        {user && (
          <div className="flex items-center gap-2 font-medium">
            <Link to="/" className={linkClass("/")}>
              Dashboard
            </Link>

            <Link to="/customers" className={linkClass("/customers")}>
              Customers
            </Link>

            <Link to="/loans" className={linkClass("/loans")}>
              Loans
            </Link>

            {profile?.role === "admin" && (
              <>
                <Link to="/admin" className={linkClass("/admin")}>
                  Approvals
                </Link>

                <Link to="/admin/users" className={linkClass("/admin/users")}>
                  Users
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="text-right">
              <p className="text-sm font-medium">
                {profile?.full_name || profile?.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {profile?.role}
              </p>
            </div>

            <button
              onClick={logout}
              className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
