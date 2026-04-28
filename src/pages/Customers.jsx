import { useAuth } from "../context/AuthContext";
import { deleteCustomer, getCustomers } from "../services/customer.service";
import { Form, Link, useLoaderData, redirect } from "react-router-dom";

export async function loader() {
  const customers = await getCustomers();
  return { customers };
}

export async function action({ request }) {
  const formData = await request.formData();
  await deleteCustomer(formData.get("customer_id"), formData.get("user_id"));
  alert("The request has been sent for approval");
  return redirect("/customers");
}

export default function Customers() {
  const { customers } = useLoaderData();
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customers</h2>

        <Link to="new" className="btn btn-primary">
          + Add Customer
        </Link>
      </div>
      {customers.length === 0 ? (
        <p className="p-3 text-sm text-gray-500 text-center">No customers</p>
      ) : (
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
                    <Form
                      className="inline"
                      method="post"
                      action="delete"
                      onSubmit={(e) => {
                        if (
                          !confirm(
                            "Please confirm you want to delete this customer.",
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="customer_id" value={c.id} />
                      <input type="hidden" name="user_id" value={user.id} />
                      <button
                        type="submit"
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </Form>
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
