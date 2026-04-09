import { supabase } from "./supabaseClient";

export const createLoan = async (loan) => {
  const { data, error } = await supabase.from("pending_actions").insert({
    action_type: "create",
    entity_type: "loan",
    data: loan,
  }); 

  if (error) throw error;
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

export const deleteLoan = async (id) => {
  const { data, error } = await supabase.from("pending_actions").insert({
    action_type: "delete",
    entity_type: "loan",
    entity_id: id,
  });

  if (error) throw error;
  return data;
};
