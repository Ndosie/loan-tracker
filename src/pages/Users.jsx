import { useAuth } from "../context/AuthContext";
import { deleteProfile, getUsers } from "../services/profile.service";
import { Form, useLoaderData, redirect } from "react-router-dom";

export async function loader() {
  const users = await getUsers();
  return { users };
}

export async function action({ request }) {
  const formData = await request.formData();
  await deleteProfile(formData.get("user_id"));
  alert("The user has been deleted.");
  return redirect(".");
}

export default function Users() {
  const { profile, loading } = useAuth();
  const { users } = useLoaderData();

  if (loading) return <p>Loading...</p>;

  if (profile?.role !== "admin")
    return <p>You are not authorized to access this page.</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
      </div>
      {users.length === 0 ? (
        <p className="p-3 text-sm text-gray-500 text-center">No users</p>
      ) : (
        <div className="bg-white shadow rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.full_name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </td>

                  <td className="p-3">
                    <Form
                      method="post"
                      action="delete"
                      onSubmit={(e) => {
                        if (
                          !confirm(
                            "Please confirm you want to delete this user.",
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
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
