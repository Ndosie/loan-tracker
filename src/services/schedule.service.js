import { supabase } from "./supabaseClient";

export const generateSchedule = async ({
  loan_id,
  total_amount,
  duration,
  start_date,
}) => {
  const installment = total_amount / duration;

  let schedules = [];

  for (let i = 0; i < duration; i++) {
    const dueDate = new Date(start_date);
    dueDate.setDate(dueDate.getDate() + (i + 1) * 7); // weekly

    schedules.push({
      loan_id,
      due_date: dueDate,
      amount_due: installment,
    });
  }

  const { data, error } = await supabase
    .from("loan_schedules")
    .insert(schedules);

  if (error) throw error;

  return data;
};
