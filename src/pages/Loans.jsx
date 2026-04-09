import { useEffect, useState } from "react";
import { deleteLoan, getLoans } from "../services/loan.service";
import { Link } from "react-router-dom";

export default function Loans() {
  const [loans, setLoans] = useState([]);

  const loadLoans = async () => {
    const data = await getLoans();
    setLoans(data);
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this loan?");

    if (!confirmDelete) return;

    await deleteLoan(id);
    loadLoans();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Loans</h2>
          <p className="text-gray-500 text-sm">Manage all issued loans</p>
        </div>

        <Link to="/loans/new" className="btn btn-primary">
          + Add Loan
        </Link>
      </div>

      <div className="bg-white shadow rounded-2xl p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Upfront</th>
              <th className="p-3">Installment</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
              <th className="p-3">View</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((l) => (
              <tr key={l.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{l.customers?.name}</td>
                <td className="p-3">{l.amount.toLocaleString()}</td>
                <td className="p-3">{l.upfront_amount.toLocaleString()}</td>
                <td className="p-3">{l.installment_amount.toLocaleString()}</td>
                <td>{l.duration} weeks</td>

                <td className="p-3">
                  <span
                    className={
                      l.status === "completed"
                        ? "text-green-600 font-medium"
                        : "text-yellow-600 font-medium"
                    }
                  >
                    {l.status}
                  </span>
                </td>

                <td className="space-x-2">
                  <Link
                    to={`/loans/edit/${l.id}`}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(l.id)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>

                <td>
                  <Link
                    to={`/loans/${l.id}`}
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
    </div>
  );
}
