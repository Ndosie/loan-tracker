import { useState } from "react";
import { createCustomer } from "../services/customer.service";
import { Form, redirect, useNavigate } from "react-router-dom";

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await createCustomer(data);
  alert("Request has been sent to administrator for approval.");
  return redirect("/customers");
}

export default function AddCustomer() {
  const [form, setForm] = useState({
    name: "",
    nida: "",
    phone: "",
    address: "",
    documents: "",
  });

  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <Form className="card" method="post">
        <h2 className="text-xl font-bold mb-4">Add Customer</h2>

        <input
          className="input mb-3"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="input mb-3"
          name="nida"
          placeholder="NIDA"
          value={form.nida}
          onChange={(e) => setForm({ ...form, nida: e.target.value })}
        />

        <input
          className="input mb-3"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="input mb-4"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <input
          className="input mb-4"
          name="documents"
          placeholder="Documents link"
          value={form.documents}
          onChange={(e) => setForm({ ...form, documents: e.target.value })}
        />

        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit">
            Save
          </button>

          <button
            onClick={() => navigate("/customers")}
            className="btn btn-secondary"
            type="button"
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
