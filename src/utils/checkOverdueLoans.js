import { getUsers } from "../services/profile.service";
import { getOverdueLoans } from "../services/schedule.service";
import { createNotification } from "../services/notification.service";

export const checkOverdueLoans = async () => {
  const overdue = await getOverdueLoans();

  if (!overdue.length) return;

  const users = await getUsers();

  overdue.forEach(async (item) => {
    await createNotification(users, {
      title: "Overdue Loan",
      message: `Loan ${item.loan_id} is overdue`,
      type: "overdue",
      reference_id: item.loan_id,
    });
  });
};
