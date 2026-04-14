import { useState } from "react";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      alert(`Login failed: ${err}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Mic Finance Limited
          </h1>
          <p className="text-gray-500 text-sm">Loan Tracker System</p>
        </div>
        <form onSubmit={handleLogin} className="card w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

          <input
            className="input mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input mb-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-full" type="submit">
            Login
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Mic Finance Limited
        </p>
      </div>
    </div>
  );
}
