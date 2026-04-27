import { supabase } from "./supabaseClient";
import { createNotification } from "./notification.service";
import { getUsersByRole } from "./profile.service";

const admins = await getUsersByRole("admin");

export const createCustomer = async (customer, user_id) => {
  const { data, error } = await supabase
    .from("pending_actions")
    .insert({
      action_type: "create",
      entity_type: "customer",
      data: customer,
      created_by: user_id,
    })
    .select()
    .single();

  if (error) throw error;
  console.log(data);

  await createNotification(admins, {
    title: "Approval needed",
    message: "New customer creation request",
    type: "approval_request",
    reference_id: data.id,
  });

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

export const getCustomerById = async (id) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const updateCustomer = async (id, updates, user_id) => {
  const { data, error } = await supabase
    .from("pending_actions")
    .insert({
      action_type: "update",
      entity_type: "customer",
      entity_id: id,
      data: updates,
      created_by: user_id,
    })
    .select()
    .single();

  if (error) throw error;

  await createNotification(admins, {
    title: "Approval needed",
    message: "Editing customer request",
    type: "approval_request",
    reference_id: data.id,
  });

  return data;
};

export const deleteCustomer = async (id, user_id) => {
  const customer = await getCustomerById(id);
  const { data, error } = await supabase
    .from("pending_actions")
    .insert({
      action_type: "delete",
      entity_type: "customer",
      entity_id: id,
      data: customer,
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
