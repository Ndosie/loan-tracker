import { supabase } from "./supabaseClient";

export const createNotification = async (users, request) => {
  const notifications = users.map((user) => ({
    user_id: user.id,
    title: request.title,
    message: request.message,
    type: request.type,
    reference_id: request.reference_id,
  }));

  const { data, error } = await supabase
    .from("notifications")
    .upsert(notifications, {
      onConflict: "reference_id",
      ignoreDuplicates: true,
    });

  if (error) throw error;
  return data;
};

export const getNotifications = async () => {
  const { data, error } = await supabase.from("notifications").select("*");

  if (error) throw error;
  return data;
};

export const getNotificationsByUserId = async (id) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", id)
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getNotificationByPendingId = async (id) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("reference_id", id)
    .single();

  if (error) throw error;
  return data;
};

export const updateNotification = async (id, data) => {
  const { error } = await supabase
    .from("notifications")
    .update(data)
    .eq("id", id);

  if (error) throw error;
};

export const deleteNotification = async (id) => {
  const { error } = await supabase.from("notifications").delete().eq("id", id);
  if (error) throw error;
};
