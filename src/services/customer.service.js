import { supabase } from "./supabaseClient";

export const createCustomer = async (customer) => {
  const { data, error } = await supabase.from("pending_actions").insert({
    action_type: "create",
    entity_type: "customer",
    data: customer,
  });

  if (error) throw error;
  return data;
};

export const getCustomers = async () => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const updateCustomer = async (id, updates) => {
  const { data, error } = await supabase.from("pending_actions").insert({
    action_type: "update",
    entity_type: "customer",
    entity_id: id,
    data: updates,
  });

  if (error) throw error;
  return data;
};

export const deleteCustomer = async (id) => {
  const { data, error } = await supabase.from("pending_actions").insert({
    action_type: "delete",
    entity_type: "customer",
    entity_id: id,
  });

  if (error) throw error;
  return data;
};
