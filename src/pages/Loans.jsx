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
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Loans</h2>
          <p className="text-gray-500 text-sm">Manage all issued loans</p>
        </div>

        <Link to="/loans/new" className="btn btn-primary">
          + Add Loan
        </Link>
      </div>

      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Amount</th>
            <th>Upfront Amount</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {loans.map((l) => (
            <tr key={l.id}>
              <td className="font-medium">{l.customers?.name}</td>
              <td>{l.amount}</td>
              <td>{l.upfront_amount}</td>
              <td>{l.duration} weeks</td>

              <td>
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
                <Link to={`/loans/edit/${l.id}`} className="text-blue-500">
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(l.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>

              <td>
                <Link to={`/loans/${l.id}`} className="text-blue-500">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
