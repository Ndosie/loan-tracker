import { Link, useLoaderData } from "react-router-dom";
import { getOverdueLoans } from "../services/schedule.service";

export async function loader() {
  const overdues = await getOverdueLoans();
  return { overdues };
}

export default function OverdueLoans() {
  const { overdues } = useLoaderData();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Overdue Loans</h2>
        </div>

        <Link
          to="/loans/new"
          className="btn btn-primary w-full sm:w-auto text-center"
        >
          + Add Loan
        </Link>
      </div>
      {overdues.length === 0 ? (
        <p className="p-3 text-sm text-gray-500 text-center">
          No overdue loans
        </p>
      ) : (
        <div className="bg-white shadow rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Customer</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Amount Due</th>
                <th className="p-3">View</th>
              </tr>
            </thead>

            <tbody>
              {overdues.map((l) => (
                <tr key={l.loan_id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{l.customer}</td>
                  <td className="p-3">{l.phone}</td>
                  <td className="p-3">{l.amount_due.toLocaleString()}</td>
                  <td>
                    <Link
                      to={`/loans/${l.loan_id}`}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
