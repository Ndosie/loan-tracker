import { supabase } from "./supabaseClient";
import { createNotification } from "./notification.service";
import { getUsersByRole } from "./profile.service";

const admins = await getUsersByRole("admins");

export const createLoan = async (loan, user_id) => {
  const { data, error } = await supabase
    .from("pending_actions")
    .insert({
      action_type: "create",
      entity_type: "loan",
      data: loan,
      created_by: user_id,
    })
    .select()
    .single();

  if (error) throw error;

  await createNotification(admins, {
    title: "Approval needed",
    message: "New loan creation request",
    type: "approval_request",
    reference_id: data.id,
  });

  return data;
};

export const getLoans = async () => {
  const { data, error } = await supabase
    .from("loans")
    .select("*, customers(*)");

  if (error) throw error;
  return data;
};

export const getLoanById = async (id) => {
  const { data, error } = await supabase
    .from("loans")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const updateLoan = async (id, updates) => {
  const { data, error } = await supabase.from("pending_actions").insert({
    action_type: "update",
    entity_type: "loan",
    entity_id: id,
    data: updates,
  });

  if (error) throw error;
  return data;
};

export const deleteLoan = async (id, user_id) => {
  const loan = await getLoanById(id);
  const { data, error } = await supabase
    .from("pending_actions")
    .insert({
      action_type: "delete",
      entity_type: "loan",
      entity_id: id,
      data: loan,
      created_by: user_id,
    })
    .select()
    .single();

  if (error) throw error;

  await createNotification(admins, {
    title: "Approval needed",
    message: "Deleting customer request",
    type: "approval_request",
    reference_id: data.id,
  });

  return data;
};
