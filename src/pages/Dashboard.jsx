import { useLoaderData } from "react-router-dom";
import {
  setOverdueLoans,
  notifyOverdueLoans,
} from "../utils/checkOverdueLoans";
import { useEffect } from "react";
import { getPayments } from "../services/payment.service";
import { getLoans } from "../services/loan.service";
import { getOverdueLoans } from "../services/schedule.service";
import { calculateCollections } from "../utils/calculations";

export async function loader() {
  const loans = await getLoans();
  const payments = await getPayments();
  const overdues = await getOverdueLoans();
  return { loans, payments, overdues };
}

export default function Dashboard() {
  const { loans, payments, overdues } = useLoaderData();
  const totalLoans = loans.length;
  const totalAmount = loans.reduce((sum, l) => sum + l.total_amount, 0);
  const totalPayments = payments.reduce((sum, l) => sum + l.amount, 0);
  const totalUpfront = loans.reduce((sum, l) => sum + l.upfront_amount, 0);
  const totalOverdues = overdues.reduce((sum, o) => sum + o.amount_due, 0);
  const { lastMonth, thisMonth, thisWeek } = calculateCollections(payments);

  useEffect(() => {
    const checkOverdues = async () => {
      await setOverdueLoans();
      await notifyOverdueLoans();
    };
    checkOverdues();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p>Total Loans</p>
          <h2 className="text-xl font-bold">{totalLoans}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Total Amount</p>
          <h2 className="text-xl font-bold">{totalAmount.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Total Upfront Amounts</p>
          <h2 className="text-xl font-bold">{totalUpfront.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Total Payments</p>
          <h2 className="text-xl font-bold">
            {totalPayments.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Total Overdues</p>
          <h2 className="text-xl font-bold">
            {totalOverdues.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Last Month Collections</p>
          <h2 className="text-xl font-bold">{lastMonth.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>This Month Collections</p>
          <h2 className="text-xl font-bold">{thisMonth.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>This Week Collections</p>
          <h2 className="text-xl font-bold">{thisWeek.toLocaleString()}</h2>
        </div>
      </div>
    </div>
  );
}
