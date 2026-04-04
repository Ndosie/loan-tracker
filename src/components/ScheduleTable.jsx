export default function ScheduleTable({ schedules }) {
  return (
    <table className="table">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2">Due Date</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {schedules.map((s) => (
          <tr key={s.id} className="border-t">
            <td className="p-2">{new Date(s.due_date).toLocaleDateString()}</td>
            <td>{s.amount_due}</td>
            <td>
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
  );
}
