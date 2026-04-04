import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateCustomer, getCustomers } from "../services/customer.service";

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    nida: "",
    phone: "",
    address: "",
    documents: "",
  });

  useEffect(() => {
    const loadCustomer = async () => {
      const customers = await getCustomers();
      const customer = customers.find((c) => c.id === id);
      setForm(customer);
    };
    loadCustomer();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCustomer(id, form);
    navigate("/customers");
  };

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-xl font-bold mb-4">Edit Customer</h2>

        <input
          className="input mb-3"
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
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="input mb-4"
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
          <button className="btn btn-primary">Update</button>

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
