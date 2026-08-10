import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { Bell, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getActionById } from "../services/action.service";
import { deleteNotification } from "../services/notification.service";

export default function Navbar() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const notificationRef = useRef(null);
  const { notifications, setNotifications } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = (path) =>
    `px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
      location.pathname === path
        ? "bg-blue-100 text-blue-600"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const handleNotificationClick = async (n) => {
    if (n.type === "overdue") {
      navigate(`/loans/${n.reference_id}`);
    }

    if (n.type === "approval_request") {
      navigate("/admin");
    }

    if (n.type === "approval_result") {
      const action = await getActionById(n.reference_id);
      if (action.entity_type === "loan") {
        navigate("/loans");
      }

      if (action.entity_type === "customer") {
        navigate("/customers");
      }
    }
    setNotifications((prev) => prev.filter((x) => x.id !== n.id));
    await deleteNotification(n.id);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-blue-600 leading-tight">
                  Mic Finance Limited
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Loan Tracker System
                </p>
              </div>
            </div>

            {user && (
              <div className="hidden md:ml-6 md:flex md:space-x-2 md:items-center">
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
                    <Link
                      to="/admin/users"
                      className={linkClass("/admin/users")}
                    >
                      Users
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setOpen(!open)}
                    className="relative p-2 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-xl border border-gray-100 z-50">
                      <div className="p-3 border-b border-gray-100 font-semibold text-gray-800 text-sm">
                        Notifications
                      </div>

                      {notifications.length === 0 ? (
                        <p className="p-4 text-xs text-gray-500 text-center">
                          No notifications
                        </p>
                      ) : (
                        <ul className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                          {notifications.map((n) => (
                            <li
                              key={n.id}
                              className={`p-3 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors ${
                                n.is_read ? "text-gray-400" : "font-semibold"
                              }`}
                              onClick={() => handleNotificationClick(n)}
                            >
                              {n.message}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">
                    {profile?.full_name || profile?.email}
                  </p>
                  <p className="text-[10px] text-gray-500 capitalize">
                    {profile?.role}
                  </p>
                </div>

                <button
                  onClick={logout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hidden sm:block"
                >
                  Logout
                </button>

                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {user && menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1 font-medium pb-3 border-b border-gray-100">
            <Link
              to="/"
              className={linkClass("/")}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/customers"
              className={linkClass("/customers")}
              onClick={() => setMenuOpen(false)}
            >
              Customers
            </Link>
            <Link
              to="/loans"
              className={linkClass("/loans")}
              onClick={() => setMenuOpen(false)}
            >
              Loans
            </Link>
            {profile?.role === "admin" && (
              <>
                <Link
                  to="/admin"
                  className={linkClass("/admin")}
                  onClick={() => setMenuOpen(false)}
                >
                  Approvals
                </Link>
                <Link
                  to="/admin/users"
                  className={linkClass("/admin/users")}
                  onClick={() => setMenuOpen(false)}
                >
                  Users
                </Link>
              </>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-800">
                {profile?.full_name || profile?.email}
              </p>
              <p className="text-[10px] text-gray-500 capitalize">
                {profile?.role}
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
