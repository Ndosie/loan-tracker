import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createLoan } from "../services/loan.service";
import { getCustomers } from "../services/customer.service";
import { Form, useNavigate, redirect, useLoaderData } from "react-router-dom";

export async function loader() {
  const customers = await getCustomers();
  return { customers };
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await createLoan(data, data.user_id);
  alert("Request has been sent to administrator for approval.");
  return redirect("/loans");
}

export default function AddLoan() {
  const [form, setForm] = useState({
    customer_id: "",
    amount: "",
    upfront_amount: "",
    installment_amount: "",
    duration: "",
  });

  const { customers } = useLoaderData();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex justify-center">
      <Form method="post" className="card">
        <h2 className="text-xl font-bold mb-4">Create Loan</h2>
        <input type="hidden" name="user_id" value={user.id} />

        <select
          className="input mb-3"
          name="customer_id"
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
          name="amount"
          type="number"
          placeholder="Loan Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          className="input mb-3"
          name="upfront_amount"
          type="number"
          placeholder="Upfront amount"
          value={form.upfront_amount}
          onChange={(e) => setForm({ ...form, upfront_amount: e.target.value })}
        />

        <input
          className="input mb-3"
          name="installment_amount"
          type="number"
          placeholder="Installment amount"
          value={form.installment_amount}
          onChange={(e) =>
            setForm({ ...form, installment_amount: e.target.value })
          }
        />

        <input
          className="input mb-4"
          name="duration"
          type="number"
          placeholder="Duration (weeks)"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary">
            Create Loan
          </button>

          <button
            type="button"
            onClick={() => navigate("/loans")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
