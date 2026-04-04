import { supabase } from "./supabaseClient";

export const applyPenalties = async () => {
  const today = new Date();

  // Get overdue schedules
  const { data: overdue } = await supabase
    .from("loan_schedules")
    .select("*")
    .lt("due_date", today)
    .eq("status", "pending");

  for (const item of overdue) {
    // Check if penalty already exists
    const { data: existing } = await supabase
      .from("penalties")
      .select("*")
      .eq("schedule_id", item.id);

    if (existing.length === 0) {
      const penaltyAmount = item.amount_due * 0.05; // 5%

      await supabase.from("penalties").insert([
        {
          loan_id: item.loan_id,
          schedule_id: item.id,
          amount: penaltyAmount,
          reason: "Late payment",
        },
      ]);

      // Mark overdue
      await supabase
        .from("loan_schedules")
        .update({ status: "overdue" })
        .eq("id", item.id);
    }
  }
};
