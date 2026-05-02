import { getUsers } from "../services/profile.service";
import { getOverdueLoans } from "../services/schedule.service";
import { createNotification } from "../services/notification.service";
import { getCustomerById } from "../services/customer.service";
import { supabase } from "../services/supabaseClient";

export const checkOverdueLoans = async () => {
  const overdues = await getOverdueLoans();

  if (!overdues.length) return;

  const users = await getUsers();

  const uniqueDues = overdues.filter(
    (obj, index, self) =>
      index === self.findIndex((t) => t.loan_id === obj.loan_id),
  );

  uniqueDues.map(async (overdue) => {
    const customer = await getCustomerById(overdue.loans.customer_id);
    await createNotification(users, {
      title: "Overdue Loan",
      message: `Loan for ${customer.name} is overdue`,
      type: "overdue",
      reference_id: overdue.loan_id,
    });
  });

  await supabase
    .from("loan_schedules")
    .update({ notified: true, status: "overdue" })
    .in(
      "id",
      overdues.map((o) => o.id),
    );
};
