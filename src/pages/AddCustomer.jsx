import { useState } from "react";
import { createCustomer } from "../services/customer.service";
import { useNavigate } from "react-router-dom";

export default function AddCustomer() {
  const [form, setForm] = useState({
    name: "",
    nida: "",
    phone: "",
    address: "",
    documents: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCustomer(form);
    navigate("/customers");
  };

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-xl font-bold mb-4">Add Customer</h2>

        <input
          className="input mb-3"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="input mb-3"
          placeholder="NIDA"
          value={form.nida}
          onChange={(e) => setForm({ ...form, nida: e.target.value })}
        />

        <input
          className="input mb-3"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="input mb-4"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <input
          className="input mb-4"
          placeholder="Documents link"
          value={form.documents}
          onChange={(e) => setForm({ ...form, documents: e.target.value })}
        />

        <div className="flex gap-2">
          <button className="btn btn-primary">Save</button>

          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
