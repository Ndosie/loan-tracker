import { useLoaderData } from "react-router-dom";

export default function Dashboard() {
  const { loans } = useLoaderData();
  const totalLoans = loans.length;
  const totalAmount = loans.reduce((sum, l) => sum + l.total_amount, 0);
  const activeLoans = loans.filter((l) => l.status === "active").length;

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
          <p>Active Loans</p>
          <h2 className="text-xl font-bold">{activeLoans}</h2>
        </div>
      </div>
    </div>
  );
}
