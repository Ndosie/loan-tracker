import { Form, redirect, useLoaderData } from "react-router-dom";
import { useState } from "react";
import { getLoanDetails } from "../services/loanDetails.service";
import { addPayment } from "../services/payment.service";
import ScheduleTable from "../components/ScheduleTable";
import CustomerCard from "../components/CustomerCard";
import { getCustomerById } from "../services/customer.service";

export async function loader({ params }) {
  const loan = await getLoanDetails(params.loanId);
  const customer = await getCustomerById(loan.customer_id);
  return { loan, customer };
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const loan = await getLoanDetails(params.loanId);
  if (Number(data.amount) !== loan.installment_amount) {
    alert(
      `The amount should be the same as the installment amount ${loan.installment_amount}`,
    );
    return;
  }
  await addPayment({ loan_id: params.loanId, amount: Number(data.amount) });
  alert("Payment has been added");
  return redirect(".");
}

export default function LoanDetails() {
  const { loan, customer } = useLoaderData();
  const [form, setForm] = useState({
    amount: "",
  });

  return (
    <div className="space-y-6">
      <CustomerCard customer={customer} />
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Loan Details</h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-lg font-semibold">
              {loan.total_amount.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-lg font-semibold text-green-600">
              {loan.totalPaid.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Balance</p>
            <p className="text-lg font-semibold text-red-600">
              {loan.balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="card max-w-md">
        <h3 className="text-lg font-semibold mb-3">Record Payment</h3>

        <Form method="post">
          <div className="flex gap-2">
            <input
              className="input flex-1"
              name="amount"
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <button type="submit" className="btn btn-primary">
              Pay
            </button>
          </div>
        </Form>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Payments History</h3>

        {loan.payments.length === 0 ? (
          <p className="text-gray-500 text-sm">No payments yet</p>
        ) : (
          <div className="space-y-2">
            {loan.payments.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
              >
                <span className="text-sm text-gray-600">
                  {new Date(p.payment_date).toLocaleDateString()}
                </span>

                <span className="font-semibold">
                  {p.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Repayment Schedule</h3>

        <ScheduleTable schedules={loan.schedules} />
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Penalties</h3>

        {loan.penalties.length === 0 ? (
          <p className="text-gray-500 text-sm">No penalties</p>
        ) : (
          <div className="space-y-2">
            {loan.penalties.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center bg-red-50 p-3 rounded-lg"
              >
                <span className="text-sm text-gray-600">{p.reason}</span>

                <span className="text-red-600 font-semibold">{p.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
