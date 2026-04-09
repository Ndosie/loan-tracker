export default function ScheduleTable({ schedules }) {
  return (
    <div className="bg-white shadow rounded-2xl p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="p-3">Due Date</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {schedules.map((s) => (
            <tr key={s.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                {new Date(s.due_date).toLocaleDateString()}
              </td>
              <td className="p-3">{s.amount_due.toLocaleString()}</td>
              <td className="p-3">
                <span
                  className={
                    s.status === "paid"
                      ? "text-green-600"
                      : s.status === "overdue"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }
                >
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
