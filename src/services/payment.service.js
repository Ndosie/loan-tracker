import { getLoanById } from "./loan.service";
import { supabase } from "./supabaseClient";

export const addPayment = async ({
  loan_id,
  amount,
  payment_date,
  reference,
}) => {
  const { data: schedules } = await supabase
    .from("schedules")
    .select("*")
    .eq("loan_id", loan_id)
    .in("status", ["overdue", "pending"])
    .order("due_date", { ascending: true });

  let remainingPayment = amount;
  let schedule = null;

  const { data, error } = await supabase.from("payments").insert([
    {
      loan_id,
      amount: amount,
      payment_date,
      reference: reference || null,
    },
  ]);

  if (error) throw error;

  if (schedules && schedules.length > 0) {
    for (let i = 0; i < schedules.length; i++) {
      if (remainingPayment <= 0) break;

      schedule = schedules[i];

      if (remainingPayment >= schedule.amount_due) {
        const loan = await getLoanById(loan_id);
        await supabase
          .from("schedules")
          .update({ status: "paid", amount_due: loan.installment_amount })
          .eq("id", schedule.id);

        remainingPayment -= schedule.amount_due;
      } else {
        const newAmountDue = schedule.amount_due - remainingPayment;
        remainingPayment = 0;

        await supabase
          .from("schedules")
          .update({ amount_due: newAmountDue })
          .eq("id", schedule.id);
      }
    }
  }

  return data;
};

export const getPayments = async () => {
  const { data, error } = await supabase.from("payments").select("*");

  if (error) throw error;
  return data;
};
