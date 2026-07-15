import {
  getPendingActions,
  processAndReview,
  updateAction,
  getProcessedActions,
} from "../services/action.service";
import { getUsersByIds } from "../services/profile.service";
import { getCustomersByIds } from "../services/customer.service";
import ApprovalCard from "../components/ApprovalCard";
import { createNotification } from "../services/notification.service";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLoaderData } from "react-router-dom";

export async function loader() {
  const pending = await getPendingActions();
  const userIds = [
    ...new Set(
      pending.flatMap((a) => [a.created_by, a.reviewed_by].filter(Boolean)),
    ),
  ];
  const customerIds = [
    ...new Set(pending.map((a) => a.data?.customer_id).filter(Boolean)),
  ];

  const [users, customers] = await Promise.all([
    userIds.length ? getUsersByIds(userIds) : [],
    customerIds.length ? getCustomersByIds(customerIds) : [],
  ]);

  const usersMap = Object.fromEntries(users.map((u) => [u.id, u]));
  const customersMap = Object.fromEntries(customers.map((c) => [c.id, c]));

  return { pending, usersMap, customersMap };
}

export default function AdminPanel() {
  const { user, profile } = useAuth();
  const { pending: initialPending, usersMap, customersMap } = useLoaderData();
  const [pending, setPending] = useState(initialPending || []);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const PAGE_SIZE = 5;
  const [processed, setProcessed] = useState([]);
  const [processedPage, setProcessedPage] = useState(0);
  const [processedLoading, setProcessedLoading] = useState(false);
  const [processedHasMore, setProcessedHasMore] = useState(true);
  const [showProcessed, setShowProcessed] = useState(false);

  if (profile?.role !== "admin") {
    return (
      <p className="p-3 text-sm text-gray-500 text-center">
        You are not authorized to access this page.
      </p>
    );
  }

  const approve = async (action) => {
    setPending((p) => p.filter((a) => a.id !== action.id));
    setLoadingIds((s) => new Set([...s, action.id]));
    try {
      await processAndReview(action, user.id, "approved");
      const creator = usersMap[action.created_by] || null;
      await createNotification([creator], {
        title: "Approved",
        message: `${action.action_type.charAt(0).toUpperCase() + action.action_type.slice(1)} ${action.entity_type} request approved`,
        type: "approval_result",
        reference_id: action.id,
      });
    } catch (e) {
      setPending((p) => [action, ...p]);
      throw e;
    } finally {
      setLoadingIds((s) => {
        const copy = new Set(s);
        copy.delete(action.id);
        return copy;
      });
    }
  };

  const reject = async (action) => {
    setPending((p) => p.filter((a) => a.id !== action.id));
    setLoadingIds((s) => new Set([...s, action.id]));
    try {
      await updateAction(action.id, {
        status: "rejected",
        reviewed_by: user.id,
      });
      const creator = usersMap[action.created_by] || null;
      await createNotification([creator], {
        title: "Rejected",
        message: `${action.action_type.charAt(0).toUpperCase() + action.action_type.slice(1)} ${action.entity_type} request rejected`,
        type: "approval_result",
        reference_id: action.id,
      });
    } catch (e) {
      setPending((p) => [action, ...p]);
      throw e;
    } finally {
      setLoadingIds((s) => {
        const copy = new Set(s);
        copy.delete(action.id);
        return copy;
      });
    }
  };

  const loadProcessed = async (reset = false) => {
    if (processedLoading) return;
    setProcessedLoading(true);
    try {
      const nextPage = reset ? 0 : processedPage;
      const offset = nextPage * PAGE_SIZE;
      const items = await getProcessedActions(PAGE_SIZE, offset);
      if (reset) {
        setProcessed(items);
        setProcessedPage(1);
      } else {
        setProcessed((p) => [...p, ...items]);
        setProcessedPage((p) => p + 1);
      }
      if (!items || items.length < PAGE_SIZE) {
        setProcessedHasMore(false);
      } else {
        setProcessedHasMore(true);
      }
    } finally {
      setProcessedLoading(false);
    }
  };

  const handleShowProcessed = async () => {
    setShowProcessed(true);
    if (processed.length === 0) {
      await loadProcessed(true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-gray-500">No pending actions</p>
        ) : (
          pending.map((a) => (
            <div key={a.id} className="border p-4 rounded-lg mb-3">
              <ApprovalCard
                approval={a}
                usersMap={usersMap}
                customersMap={customersMap}
              />

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => approve(a)}
                  className="btn btn-primary"
                  disabled={loadingIds.has(a.id)}
                >
                  {loadingIds.has(a.id) ? "Processing…" : "Approve"}
                </button>

                <button
                  onClick={() => reject(a)}
                  className="btn btn-secondary"
                  disabled={loadingIds.has(a.id)}
                >
                  {loadingIds.has(a.id) ? "Processing…" : "Reject"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Processed Actions</h2>

        {!showProcessed ? (
          <div className="flex gap-2">
            <button onClick={handleShowProcessed} className="btn btn-outline">
              Show processed
            </button>
          </div>
        ) : (
          <>
            {processed.length === 0 && !processedLoading ? (
              <p className="text-sm text-gray-500">No processed actions</p>
            ) : (
              processed.map((a) => (
                <div key={a.id} className="border p-4 rounded-lg mb-3">
                  <ApprovalCard
                    approval={a}
                    usersMap={usersMap}
                    customersMap={customersMap}
                  />
                </div>
              ))
            )}

            <div className="flex gap-2 mt-3">
              {processedHasMore ? (
                <button
                  onClick={() => loadProcessed(false)}
                  className="btn btn-outline"
                  disabled={processedLoading}
                >
                  {processedLoading ? "Loading…" : "Load more"}
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  No more processed actions
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
