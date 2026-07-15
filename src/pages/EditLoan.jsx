import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { editLoan, getLoanById } from "../services/loan.service";
import { getCustomerById } from "../services/customer.service";
import {
  Form,
  useNavigate,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router-dom";

export async function loader({ params }) {
  const loan = await getLoanById(params.loanId);
  const customer = await getCustomerById(loan.customer_id);
  return { loan, customer };
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await editLoan(params.loanId, data, data.user_id);
  alert("Request has been sent to administrator for approval.");
  return redirect("/loans");
}

export default function EditLoan() {
  const { loan, customer } = useLoaderData();
  const [status, setStatus] = useState(loan.status);
  const navigate = useNavigate();
  const { user } = useAuth();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const LOAN_STATUES = ["active", "completed", "defaulted"];

  return (
    <div className="flex justify-center items-center w-full">
      <Form method="post" className="card w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Loan</h2>
        <input type="hidden" name="user_id" value={user.id} />

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Customer</label>
          <input
            type="text"
            name="customer_id"
            required
            value={customer.name}
            disabled
            className="input text-gray-400"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Loan Amount
          </label>
          <input
            type="number"
            name="amount"
            required
            value={loan.amount}
            disabled
            className="input text-gray-400"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Upfront amount
          </label>
          <input
            type="number"
            className="input text-gray-400"
            name="upfront_amount"
            required
            value={loan.upfront_amount}
            disabled
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Installment amount
          </label>
          <input
            type="number"
            className="input text-gray-400"
            name="installment_amount"
            required
            value={loan.installment_amount}
            disabled
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Duration (weeks)
          </label>
          <input
            type="number"
            className="input text-gray-400"
            name="duration"
            required
            value={loan.duration}
            disabled
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            className="input text-gray-400"
            name="start_date"
            required
            value={loan.start_date}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select
            className="input"
            name="status"
            required
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {LOAN_STATUES.map((s) => (
              <option key={s} value={s} selected={loan.status === s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 justify-center mt-4">
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Edit Loan"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/loans")}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
