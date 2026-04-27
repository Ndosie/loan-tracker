import { Link } from "react-router-dom";

export default function CustomerCard({ customer }) {
  if (!customer) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">{customer.name}</h2>
          <p className="text-sm text-gray-500">Customer Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">NIDA / ID</p>
          <p className="font-medium">{customer.nida || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Phone</p>
          <p className="font-medium">{customer.phone || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{customer.email || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Address</p>
          <p className="font-medium">{customer.address || "-"}</p>
        </div>
      </div>

      {customer.documents && (
        <div className="mt-4">
          <a
            href={customer.documents}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-600 text-sm hover:underline"
          >
            📄 View Scanned Documents
          </a>
        </div>
      )}
    </div>
  );
}
