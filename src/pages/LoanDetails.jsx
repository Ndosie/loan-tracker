import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLoanDetails } from "../services/loanDetails.service";
import { addPayment } from "../services/payment.service";
import ScheduleTable from "../components/ScheduleTable";

export default function LoanDetails() {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [amount, setAmount] = useState("");

  const loadData = async () => {
    const data = await getLoanDetails(id);
    setLoan(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePayment = async () => {
    await addPayment({ loan_id: id, amount: Number(amount) });
    setAmount("");
    loadData();
  };

  if (!loan) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Loan Details</h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-lg font-semibold">{loan.total_amount}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-lg font-semibold text-green-600">
              {loan.totalPaid}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Balance</p>
            <p className="text-lg font-semibold text-red-600">{loan.balance}</p>
          </div>
        </div>
      </div>

      <div className="card max-w-md">
        <h3 className="text-lg font-semibold mb-3">Record Payment</h3>

        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button onClick={handlePayment} className="btn btn-primary">
            Pay
          </button>
        </div>
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
