import { supabase } from "./supabaseClient";
import { generateSchedule } from "./schedule.service";
import { calculateTotalLoan } from "../utils/calculations";

export const processAction = async (action) => {
  const { action_type, entity_type, entity_id, data: formData } = action;

  if (entity_type === "customer") {
    if (action_type === "create") {
      // eslint-disable-next-line no-unused-vars
      const { user_id, ...customer } = formData;
      const { data, error } = await supabase
        .from("customers")
        .insert([customer])
        .select();

      if (error) throw error;
      return data[0];
    }

    if (action_type === "update") {
      // eslint-disable-next-line no-unused-vars
      const { user_id, ...customer } = formData;
      const { error } = await supabase
        .from("customers")
        .update(customer)
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
      console.log(formData);
      // eslint-disable-next-line no-unused-vars
      const { user_id, ...loan } = formData;
      const total_amount = calculateTotalLoan(loan.amount, loan.upfront_amount);
      const { data, error } = await supabase
        .from("loans")
        .insert([
          {
            ...loan,
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
        start_date: data.start_date,
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

export const getActionById = async (id) => {
  const { data, error } = await supabase
    .from("pending_actions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};
