import { useLoaderData } from "react-router-dom";
import { checkOverdueLoans } from "../utils/checkOverdueLoans";
import { useEffect } from "react";
import { getPayments } from "../services/payment.service";
import { getLoans } from "../services/loan.service";

export async function loader() {
  const loans = await getLoans();
  const payments = await getPayments();
  return { loans, payments };
}

export default function Dashboard() {
  const { loans, payments } = useLoaderData();
  const totalLoans = loans.length;
  const totalAmount = loans.reduce((sum, l) => sum + l.total_amount, 0);
  const totalPayments = payments.reduce((sum, l) => sum + l.amount, 0);

  useEffect(() => {
    checkOverdueLoans();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p>Total Loans</p>
          <h2 className="text-xl font-bold">{totalLoans}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Total Amount</p>
          <h2 className="text-xl font-bold">{totalAmount.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Total Payments</p>
          <h2 className="text-xl font-bold">{totalPayments.toLocaleString()}</h2>
        </div>
      </div>
    </div>
  );
}
