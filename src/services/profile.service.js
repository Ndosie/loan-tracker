import { supabase } from "./supabaseClient";

export const getUsersByIds = async (ids = []) => {
  if (!ids.length) return [];
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("id", ids);

  if (error) throw error;
  return data;
};

export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const getUsersByRole = async (role) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", role);

  if (error) throw error;
  return data;
};

export const getUsers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteProfile = async (id) => {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
};
