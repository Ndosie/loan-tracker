import { getUsers } from "../services/profile.service";
import { getPendingLoans, getOverdueLoans } from "../services/schedule.service";
import {
  createNotification,
  getNotificationByLoanId,
} from "../services/notification.service";
import { getCustomerById } from "../services/customer.service";
import { supabase } from "../services/supabaseClient";
import { getLoanById } from "../services/loan.service";

export const setOverdueLoans = async () => {
  const pendings = await getPendingLoans();

  if (!pendings.length) return;

  await supabase
    .from("schedules")
    .update({ status: "overdue" })
    .in(
      "id",
      pendings.map((o) => o.id),
    );
};

export const notifyOverdueLoans = async () => {
  const overdues = await getOverdueLoans();

  if (!overdues.length) return;

  const users = await getUsers();

  const uniqueDues = overdues.filter(
    (obj, index, self) =>
      index === self.findIndex((t) => t.loan_id === obj.loan_id),
  );

  const unNotified = uniqueDues.filter(async (u) => {
    const notifications = await getNotificationByLoanId(u.loan_id);
    if (notifications.length > 0) return false;
    else return true;
  });

  const promises = unNotified.map(async (overdue) => {
    const loan = await getLoanById(overdue.loan_id);
    const customer = await getCustomerById(loan.customer_id);

    await createNotification(users, {
      title: "Overdue Loan",
      message: `Loan for ${customer.name} is overdue`,
      type: "overdue",
      reference_id: overdue.loan_id,
    });
  });

  await Promise.all(promises);
};
