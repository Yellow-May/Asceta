import { supabase } from "../config/supabase";
import api from "../services/api";

/**
 * Ensures the user exists in MongoDB after Supabase authentication
 * This function checks if the user record exists, and creates it if it doesn't
 * This keeps data in sync even if migrations fail or data gets out of sync
 */
export const ensureUserExists = async (): Promise<boolean> => {
  try {
    // Get current Supabase session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return false;
    }

    const { id: supabaseUserId, email, user_metadata } = session.user;
    // Use full_name from metadata, or fallback to email username, or empty string
    const fullName = user_metadata?.full_name || email?.split("@")[0] || "";

    if (!email || !supabaseUserId) {
      console.error("Missing required user data from Supabase");
      return false;
    }

    // Try to register/create user in MongoDB
    // The backend endpoint handles duplicates gracefully (returns existing user if found)
    // fullName is optional - backend will use email username as fallback
    try {
      await api.post("/accadd/auth/register", {
        supabaseUserId,
        email,
        fullName: fullName || undefined, // Send undefined if empty, backend will handle it
      });
      return true;
    } catch (error: any) {
      // If it's a network error, log but don't fail
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

      // If user already exists (200 status), that's fine
      if (error.response?.status === 200) {
        return true;
      }

      // Other errors - log but don't fail authentication
      console.error("Error ensuring user exists in MongoDB:", error);
      return false;
    }
  } catch (error) {
    console.error("Error in ensureUserExists:", error);
    return false;
  }
};
