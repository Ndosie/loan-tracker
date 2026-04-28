import {
  getActions,
  processAction,
  updateAction,
} from "../services/action.service";
import { useAuth } from "../context/AuthContext";
import {
  createNotification,
  getNotificationByPendingId,
} from "../services/notification.service";
import { getUserById } from "../services/profile.service";
import { useLoaderData } from "react-router-dom";

export async function loader() {
  const actions = await getActions();
  return { actions };
}

export default function AdminPanel() {
  const { user, profile } = useAuth();
  const { actions } = useLoaderData();
  const pendingActions = actions.filter((a) => a.status === "pending");
  const processedActions = actions.filter((a) => a.status !== "pending");

  if (profile?.role !== "admin")
    return (
      <p className="p-3 text-sm text-gray-500 text-center">
        You are not authorized to access this page.
      </p>
    );

  const approve = async (action) => {
    await processAction(action);
    await updateAction(action.id, { status: "approved", reviewed_by: user.id });

    const notification = await getNotificationByPendingId(action.id);
    const creator = await getUserById(action.created_by);

    await createNotification([creator], {
      title: "Approved",
      message: `${notification.message} approved`,
      type: "approval_result",
      reference_table: notification.reference_table,
      reference_id: notification.reference_id,
    });
  };

  const reject = async (action) => {
    await updateAction(action.id, { status: "rejected", reviewed_by: user.id });

    const notification = await getNotificationByPendingId(action.id);
    const creator = await getUserById(action.created_by);

    await createNotification([creator], {
      title: "Rejected",
      message: `${notification.message} rejected`,
      type: "approval_result",
      reference_table: notification.reference_table,
      reference_id: notification.reference_id,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
        {pendingActions.length === 0 ? (
          <p className="text-sm text-gray-500">No pending actions</p>
        ) : (
          pendingActions.map((a) => (
            <div key={a.id} className="border p-4 rounded-lg mb-3">
              <p className="text-sm text-gray-500">
                {a.entity_type} - {a.action_type}
              </p>

              <pre className="text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify(a.data, null, 2)}
              </pre>

              <div className="flex gap-2 mt-3">
                <button onClick={() => approve(a)} className="btn btn-primary">
                  Approve
                </button>

                <button onClick={() => reject(a)} className="btn btn-secondary">
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Processed Actions</h2>
        {processedActions.length === 0 ? (
          <p className="text-sm text-gray-500">No processed actions</p>
        ) : (
          processedActions.map((a) => (
            <div key={a.id} className="border p-4 rounded-lg mb-3">
              <p className="text-sm text-gray-500">
                {a.entity_type} - {a.action_type}
              </p>

              <pre className="text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify(a.data, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
