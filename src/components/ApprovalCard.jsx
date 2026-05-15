import React, { useEffect, useState } from "react";
import { formatApprovalData } from "../utils/formatApprovalData";

function ApprovalCard({ approval, usersMap = {}, customersMap = {} }) {
  const [formatted, setFormatted] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await formatApprovalData(approval, {
        usersMap,
        customersMap,
      });
      if (mounted) setFormatted(data);
    })();
    return () => {
      mounted = false;
    };
  }, [approval, usersMap, customersMap]);

  return (
    <div className="border p-4 rounded-lg mb-3">
      <p className="text-sm text-gray-500">
        {approval.action_type} - {approval.entity_type}
      </p>

      <div className="bg-gray-50 p-3 rounded text-sm">
        {Object.entries(formatted).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b py-1">
            <span className="text-gray-500">{key}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(ApprovalCard);
