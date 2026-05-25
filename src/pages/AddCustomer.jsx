import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createCustomer } from "../services/customer.service";
import { Form, redirect, useNavigate, useNavigation } from "react-router-dom";

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await createCustomer(data, data.user_id);
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

  const { user } = useAuth();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex justify-center items-center w-full">
      <Form className="card w-full max-w-md" method="post">
        <h2 className="text-xl font-bold mb-4">Add Customer</h2>

        <input type="hidden" name="user_id" value={user.id} />
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input
            className="input"
            name="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">NIDA / ID</label>
          <input
            className="input"
            name="nida"
            required
            value={form.nida}
            onChange={(e) => setForm({ ...form, nida: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Phone Number
          </label>
          <input
            className="input"
            name="phone"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Address</label>
          <input
            className="input"
            name="address"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Documents Link
          </label>
          <input
            className="input mb-4"
            name="documents"
            required
            value={form.documents}
            onChange={(e) => setForm({ ...form, documents: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <button
            className="btn btn-primary flex-1"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Save"}
          </button>

          <button
            onClick={() => navigate("/customers")}
            className="btn btn-secondary flex-1"
            type="button"
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
