import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { processAction } from "../services/processAction";

export default function AdminPanel() {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    const { data } = await supabase
      .from("pending_actions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    setActions(data);
  };

  const approve = async (action) => {
    await processAction(action);

    await supabase
      .from("pending_actions")
      .update({ status: "approved" })
      .eq("id", action.id);

    loadActions();
  };

  const reject = async (id) => {
    await supabase
      .from("pending_actions")
      .update({ status: "rejected" })
      .eq("id", id);

    loadActions();
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>

      {actions.map((a) => (
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

            <button onClick={() => reject(a.id)} className="btn btn-secondary">
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
