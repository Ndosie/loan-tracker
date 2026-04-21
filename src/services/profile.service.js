import { supabase } from "./supabaseClient";

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
