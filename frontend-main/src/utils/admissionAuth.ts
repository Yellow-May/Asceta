import { supabase } from "../config/supabase";
import api from "../services/api";

/**
 * Ensures the admission user exists in MongoDB after Supabase authentication
 * This function checks if the user record exists, and creates it if it doesn't
 */
export const ensureAdmissionUserExists = async (): Promise<boolean> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return false;
    }

    const { id: supabaseUserId, email, user_metadata } = session.user;
    const fullName = user_metadata?.full_name || email?.split("@")[0] || "";

    if (!email || !supabaseUserId) {
      console.error("Missing required user data from Supabase");
      return false;
    }

    try {
      await api.post("/admission-portal/auth/register", {
        supabaseUserId,
        email,
        fullName: fullName || undefined,
      });
      return true;
    } catch (error: any) {
      if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        error.message?.includes("Failed to fetch")
      ) {
        console.warn(
          "Cannot connect to backend to sync user. User authentication will continue."
        );
        return false;
      }

      if (error.response?.status === 200) {
        return true;
      }

      console.error("Error ensuring admission user exists in MongoDB:", error);
      return false;
    }
  } catch (error) {
    console.error("Error in ensureAdmissionUserExists:", error);
    return false;
  }
};
