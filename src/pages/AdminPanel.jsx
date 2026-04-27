import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { processAction } from "../services/processAction.service";
import { useAuth } from "../context/AuthContext";
import {
  createNotification,
  getNotificationByPendingId,
} from "../services/notification.service";
import { getUserById } from "../services/profile.service";

export default function AdminPanel() {
  const [pendingActions, setPendingActions] = useState([]);
  const [processedActions, setProcessedActions] = useState([]);
  const { profile } = useAuth();

  const loadActions = async () => {
    const { data } = await supabase
      .from("pending_actions")
      .select("*")
      .order("created_at", { ascending: false });

    setPendingActions(data.filter((d) => d.status === "pending"));
    setProcessedActions(data.filter((d) => d.status !== "pending"));
  };

  useEffect(() => {
    loadActions();
  }, []);

  if (profile?.role !== "admin")
    return <p>You are not authorized to access this page.</p>;

  const approve = async (action) => {
    await processAction(action);

    await supabase
      .from("pending_actions")
      .update({ status: "approved" })
      .eq("id", action.id);

    const notification = await getNotificationByPendingId(action.id);
    const user = await getUserById(action.created_by);

    await createNotification([user], {
      title: "Approved",
      message: `${notification.message} approved`,
      type: "approval_result",
      reference_table: notification.reference_table,
      reference_id: notification.reference_id,
    });

    loadActions();
  };

  const reject = async (action) => {
    await supabase
      .from("pending_actions")
      .update({ status: "rejected" })
      .eq("id", action.id);

    const notification = await getNotificationByPendingId(action.id);
    const user = await getUserById(action.created_by);

    await createNotification([user], {
      title: "Rejected",
      message: `${notification.message} rejected`,
      type: "approval_result",
      reference_table: notification.reference_table,
      reference_id: notification.reference_id,
    });

    loadActions();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>

        {pendingActions.map((a) => (
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
        ))}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Processed Actions</h2>

        {processedActions.map((a) => (
          <div key={a.id} className="border p-4 rounded-lg mb-3">
            <p className="text-sm text-gray-500">
              {a.entity_type} - {a.action_type}
            </p>

            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(a.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
