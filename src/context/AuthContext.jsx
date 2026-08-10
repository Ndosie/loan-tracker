import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { getUserById } from "../services/profile.service";
import {
  getNotificationsByUserId,
} from "../services/notification.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const fetchProfile = async (user) => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profile = await getUserById(user.id);

    setProfile(profile);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user;
      setUser(sessionUser);
      fetchProfile(sessionUser);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user;
        setUser(sessionUser);
        fetchProfile(sessionUser);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    let isMounted = true;

    const fetchNotifations = async () => {
      const newNotifications = await getNotificationsByUserId(user.id);
      if (isMounted) setNotifications(newNotifications);
    };

    fetchNotifations();

    return () => {
      isMounted = false;
    };
  }, [user, profile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
