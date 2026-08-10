import { supabase } from "./supabaseClient";

export const createNotification = async (users, request) => {
  let targetUserId = null;
  if (Array.isArray(users)) {
    if (users.length === 1) {
      targetUserId = users[0].id || users[0];
    }
  } else if (users && typeof users === "object") {
    targetUserId = users.id;
  } else if (users) {
    targetUserId = users;
  }

  if (targetUserId === null) {
    const { data: existing } = await supabase
      .from("notifications")
      .select("id")
      .eq("reference_id", request.reference_id)
      .is("user_id", null)
      .limit(1);

    if (existing && existing.length > 0) {
      return existing;
    }
  }

  const notification = {
    user_id: targetUserId,
    title: request.title,
    message: request.message,
    type: request.type,
    reference_id: request.reference_id,
  };

  const { data, error } = await supabase
    .from("notifications")
    .upsert(notification, {
      onConflict: ["user_id", "reference_id"],
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
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", id)
    .single();

  let query = supabase.from("notifications").select("*").eq("is_read", false);

  if (profile && profile.role === "admin") {
    query = query.or(`user_id.eq.${id},user_id.is.null`);
  } else {
    query = query.eq("user_id", id);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

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

export const getNotificationByLoanId = async (id) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("reference_id", id);

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
