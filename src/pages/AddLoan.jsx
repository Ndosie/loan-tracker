import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createLoan } from "../services/loan.service";
import { getCustomers } from "../services/customer.service";
import {
  Form,
  useNavigate,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router-dom";

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
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex justify-center items-center">
      <Form method="post" className="card">
        <h2 className="text-xl font-bold mb-4">Create Loan</h2>
        <input type="hidden" name="user_id" value={user.id} />

        <div className="mb-3 w-96">
          <label className="block text-sm text-gray-600 mb-1">Customer</label>
          <select
            className="input text-gray-600"
            name="customer_id"
            required
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
        </div>

        <div className="mb-3 w-96">
          <label className="block text-sm text-gray-600 mb-1">
            Loan Amount
          </label>
          <input
            type="number"
            name="amount"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="input"
          />
        </div>

        <div className="mb-3 w-96">
          <label className="block text-sm text-gray-600 mb-1">
            Upfront amount
          </label>
          <input
            type="number"
            className="input"
            name="upfront_amount"
            required
            value={form.upfront_amount}
            onChange={(e) =>
              setForm({ ...form, upfront_amount: e.target.value })
            }
          />
        </div>
        <div className="mb-3 w-96">
          <label className="block text-sm text-gray-600 mb-1">
            Installment amount
          </label>
          <input
            type="number"
            className="input"
            name="installment_amount"
            required
            value={form.installment_amount}
            onChange={(e) =>
              setForm({ ...form, installment_amount: e.target.value })
            }
          />
        </div>
        <div className="mb-3 w-96">
          <label className="block text-sm text-gray-600 mb-1">
            Duration (weeks)
          </label>
          <input
            type="number"
            className="input"
            name="duration"
            required
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
        </div>
        <div className="mb-3 w-96">
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            className="input text-gray-600"
            name="start_date"
            required
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />
        </div>

        <div className="flex gap-2 justify-center">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Create Loan"}
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
