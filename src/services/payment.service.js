import { supabase } from "./supabaseClient";

export const addPayment = async ({ loan_id, amount }) => {
  await supabase.from("payments").insert([{ loan_id, amount }]);

  const { data: schedules } = await supabase
    .from("loan_schedules")
    .select("*")
    .eq("loan_id", loan_id)
    .eq("status", "pending")
    .order("due_date", { ascending: true })
    .limit(1);

  if (schedules.length > 0) {
    await supabase
      .from("loan_schedules")
      .update({ status: "paid" })
      .eq("id", schedules[0].id);
  }
};

export const getPayments = async () => {
  const { data, error } = await supabase.from("payments").select("*");

  if (error) throw error;
  return data;
};
