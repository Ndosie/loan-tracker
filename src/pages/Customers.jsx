import { deleteCustomer, getCustomers } from "../services/customer.service";
import { Link, useLoaderData, useNavigate } from "react-router-dom";

export async function loader() {
  const customers = await getCustomers();
  return { customers };
}

export default function Customers() {
  const { customers } = useLoaderData();
  const { navigate } = useNavigate();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmDelete) return;

    await deleteCustomer(id);
    navigate("/customers");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customers</h2>

        <Link to="new" className="btn btn-primary">
          + Add Customer
        </Link>
      </div>

      <div className="bg-white shadow rounded-2xl p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Nida</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">Documents</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.nida}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.address}</td>
                <td className="p-3">
                  <a
                    href={c.documents}
                    target="_blank"
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                  >
                    View
                  </a>
                </td>
                <td className="space-x-2">
                  <Link
                    to={`/customers/${c.id}/edit`}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
