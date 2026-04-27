import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Form, useNavigate, redirect, useLoaderData } from "react-router-dom";
import { updateCustomer, getCustomers } from "../services/customer.service";

export async function loader({ params }) {
  const customers = await getCustomers();
  const customer = customers.find((c) => c.id === params.customerId);
  return { customer };
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateCustomer(params.customerId, updates, updates.user_id);
  alert("Request has been sent to administrator for approval.");
  return redirect("/customers");
}

export default function EditCustomer() {
  const navigate = useNavigate();
  const { customer } = useLoaderData();

  const [form, setForm] = useState({
    name: customer.name,
    nida: customer.nida,
    phone: customer.phone,
    address: customer.address,
    documents: customer.documents,
  });
  const { user } = useAuth();

  return (
    <div className="flex justify-center">
      <Form method="post" className="card">
        <h2 className="text-xl font-bold mb-4">Edit Customer</h2>

        <input type="hidden" name="user_id" value={user.id} />
        <div className="mb-3 w-96">
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input
            className="input"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="mb-3 w-96">
          <label className="block text-sm text-gray-600 mb-1">NIDA / ID</label>
          <input
            className="input"
            name="nida"
            value={form.nida}
            onChange={(e) => setForm({ ...form, nida: e.target.value })}
          />
        </div>

        <div className="mb-3 w-96">
          <label className="block text-sm text-gray-600 mb-1">
            Phone Number
          </label>
          <input
            className="input"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="mb-3 w-96">
          <label className="block text-sm text-gray-600 mb-1">Address</label>
          <input
            className="input"
            name="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="mb-3 w-96">
          <label className="block text-sm text-gray-600 mb-1">
            Documents Link
          </label>
          <input
            className="input mb-4"
            name="documents"
            value={form.documents}
            onChange={(e) => setForm({ ...form, documents: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary">
            Update
          </button>

          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
