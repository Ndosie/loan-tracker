import { supabase } from "./supabaseClient";

export const generateSchedule = async ({
  loan_id,
  total_amount,
  installment,
  duration,
  start_date,
}) => {
  let remained = total_amount;
  let schedules = [];

  for (let i = 0; i < duration; i++) {
    const dueDate = new Date(start_date);
    dueDate.setDate(dueDate.getDate() + (i + 1) * 7);

    remained -= installment;

    if (remained <= installment) {
      schedules.push({
        loan_id,
        due_date: dueDate,
        amount_due: remained,
      });
      break;
    } else {
      schedules.push({
        loan_id,
        due_date: dueDate,
        amount_due: installment,
      });
    }
  }

  const { data, error } = await supabase
    .from("loan_schedules")
    .insert(schedules);

  if (error) throw error;
  return data;
};

export const getOverdueLoans = async () => {
  const today = new Date().toISOString();

  const { data, error } = await supabase
    .from("loan_schedules")
    .select("*, loans(*)")
    .lt("due_date", today)
    .match({ status: "pending", notified: false });

  if (error) throw error;
  return data;
};
