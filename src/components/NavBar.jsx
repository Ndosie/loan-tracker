import { Link } from "react-router-dom";
import { logout } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between">
      {/* LEFT SIDE */}
      {user && (
        <div className="space-x-4 font-semibold">
          <Link to="/">Dashboard</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/loans">Loans</Link>
        </div>
      )}

      {/* RIGHT SIDE */}
      <div>
        {user ? (
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <div className="space-x-3">
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
            <Link to="/register" className="text-green-500">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
