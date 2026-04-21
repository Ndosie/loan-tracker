import { supabase } from "./supabaseClient";
import { generateSchedule } from "./schedule.service";
import { calculateTotalLoan } from "../utils/calculations";

export const processAction = async (action) => {
  const { action_type, entity_type, entity_id, data: formData } = action;

  if (entity_type === "customer") {
    if (action_type === "create") {
      const { data, error } = await supabase
        .from("customers")
        .insert([formData])
        .select();

      if (error) throw error;
      return data[0];
    }

    if (action_type === "update") {
      const { error } = await supabase
        .from("customers")
        .update(formData)
        .eq("id", entity_id);
      if (error) throw error;
    }

    if (action_type === "delete") {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", entity_id);
      if (error) throw error;
    }
  }

  if (entity_type === "loan") {
    if (action_type === "create") {
      const total_amount = calculateTotalLoan(
        formData.amount,
        formData.upfront_amount,
      );
      const { data, error } = await supabase
        .from("loans")
        .insert([
          {
            ...formData,
            status: "active",
            total_amount,
          },
        ])
        .select()
        .single();
      if (error) throw error;

      await generateSchedule({
        loan_id: data.id,
        total_amount,
        installment: formData.installment_amount,
        duration: formData.duration,
        start_date: new Date(),
      });
      return data[0];
    }

    if (action_type === "update") {
      const { error } = await supabase
        .from("loans")
        .update(formData)
        .eq("id", entity_id);
      if (error) throw error;
    }

    if (action_type === "delete") {
      const { error: scheduleError } = await supabase
        .from("loan_schedules")
        .delete()
        .eq("loan_id", entity_id);
      if (scheduleError) throw scheduleError;

      const { error: paymentsError } = await supabase
        .from("payments")
        .delete()
        .eq("loan_id", entity_id);
      if (paymentsError) throw paymentsError;

      const { error: penaltiesError } = await supabase
        .from("penalties")
        .delete()
        .eq("loan_id", entity_id);
      if (penaltiesError) throw penaltiesError;

      const { error: loanError } = await supabase
        .from("loans")
        .delete()
        .eq("id", entity_id);
      if (loanError) throw loanError;
    }
  }

  
};
