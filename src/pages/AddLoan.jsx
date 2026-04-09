import { useEffect, useState } from "react";
import { createLoan } from "../services/loan.service";
import { getCustomers } from "../services/customer.service";
import { useNavigate } from "react-router-dom";

export default function AddLoan() {
  const [form, setForm] = useState({
    customer_id: "",
    amount: "",
    upfront_amount: "",
    installment_amount: "",
    duration: "",
  });

  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomers = async () => {
      const data = await getCustomers();
      setCustomers(data);
    };
    loadCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createLoan(form);
    navigate("/loans");
  };

  return (
    <div className="max-w-xl content-center">
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-xl font-bold mb-4">Create Loan</h2>
        <select
          className="input mb-3"
          value={form.customer_id}
          onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="input mb-3"
          type="number"
          placeholder="Loan Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          className="input mb-3"
          type="number"
          placeholder="Upfront amount"
          value={form.upfront_amount}
          onChange={(e) => setForm({ ...form, upfront_amount: e.target.value })}
        />

        <input
          className="input mb-3"
          type="number"
          placeholder="Installment amount"
          value={form.installment_amount}
          onChange={(e) =>
            setForm({ ...form, installment_amount: e.target.value })
          }
        />

        <input
          className="input mb-4"
          type="number"
          placeholder="Duration (weeks)"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />

        <div className="flex gap-2">
          <button className="btn btn-primary">Create Loan</button>

          <button
            type="button"
            onClick={() => navigate("/loans")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
