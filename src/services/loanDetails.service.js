import { supabase } from "./supabaseClient";

export const getLoanDetails = async (loan_id) => {
  const { data: loan } = await supabase
    .from("loans")
    .select("*")
    .eq("id", loan_id)
    .single();

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("loan_id", loan_id);

  const { data: schedules } = await supabase
    .from("loan_schedules")
    .select("*")
    .eq("loan_id", loan_id)
    .order("due_date", { ascending: true });

  const { data: penalties } = await supabase
    .from("penalties")
    .select("*")
    .eq("loan_id", loan_id);

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPenalties = penalties.reduce((sum, p) => sum + p.amount, 0);

  return {
    ...loan,
    payments,
    schedules,
    penalties,
    totalPaid,
    totalPenalties,
    balance: loan.total_amount + totalPenalties - totalPaid,
  };
};
