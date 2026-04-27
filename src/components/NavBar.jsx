import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  getNotificationsByUserId,
  updateNotification,
} from "../services/notification.service";
import { getActionById } from "../services/processAction.service";

export default function Navbar() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchNotifations = async () => {
      const newNotifications = await getNotificationsByUserId(user.id);

      setNotifications(newNotifications);
    };
    fetchNotifations();
  }, [user]);

  const handleNotificationClick = async (n) => {
    if (n.type === "overdue") {
      navigate(`/loans/${n.reference_id}`);
    }

    if (n.type === "approval_request") {
      navigate("/admin");
    }

    if (n.type === "approval_result") {
      console.log(n);
      const pending_action = await getActionById(n.reference_id);
      console.log(pending_action);
      if (pending_action.entity_type === "loan") {
        navigate("/loans");
      }

      if (pending_action.entity_type === "customer") {
        navigate("/customers");
      }
    }

    await updateNotification(n.id, { is_read: true });
  };

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
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Bell size={20} />

                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-xl border z-50">
                  <div className="p-3 border-b font-semibold">
                    Notifications
                  </div>

                  {notifications.length === 0 ? (
                    <p className="p-3 text-sm text-gray-500">
                      No notifications
                    </p>
                  ) : (
                    <ul className="max-h-60 overflow-y-auto rounded-br-2xl rounded-bl-2xl">
                      {notifications.map((n) => (
                        <li
                          key={n.id}
                          className={`p-3 text-sm  text-gray-500 cursor-pointer hover:bg-gray-50 ${
                            n.is_read
                              ? "text-gray-500"
                              : "font-semibold bg-gray-50"
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
