import { useEffect, useState } from "react";
import { deleteCustomer, getCustomers } from "../services/customer.service";
import { Link } from "react-router-dom";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmDelete) return;

    await deleteCustomer(id);
    loadCustomers();
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customers</h2>

        <Link to="/customers/new" className="btn btn-primary">
          + Add Customer
        </Link>
      </div>

      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Nida</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Documents Link</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td className="font-medium">{c.name}</td>
              <td>{c.nida}</td>
              <td>{c.phone}</td>
              <td>{c.address}</td>
              <td>
                <a href={c.documents} target="_blank">
                  Click
                </a>
              </td>
              <td className="space-x-2">
                <Link to={`/customers/edit/${c.id}`} className="text-blue-500">
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
