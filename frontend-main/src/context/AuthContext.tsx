import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../config/supabase";
import api from "../services/api";

type PortalType = "student" | "admission" | "accadd" | null;

interface StudentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "lecturer" | "admin";
  studentId?: string;
  staffId?: string;
}

interface AuthContextType {
  // Student auth
  studentUser: StudentUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;

  // Supabase auth (admission & accadd)
  supabaseUser: User | null;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    portalType: "admission" | "accadd"
  ) => Promise<{ user: User | null; session: any; error: any }>;
  signIn: (
    email: string,
    password: string,
    portalType: "admission" | "accadd"
  ) => Promise<{ user: User | null; error: any }>;

  // Common
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  portalType: PortalType;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [studentUser, setStudentUser] = useState<StudentUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalType, setPortalType] = useState<PortalType>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for student JWT token first
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setStudentUser(JSON.parse(storedUser));
          setPortalType("student");
          setLoading(false);
          return;
        }

        // Check Supabase session (for admission and accadd)
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const userPortalType = session.user.user_metadata?.portal_type;
          if (userPortalType === "admission" || userPortalType === "accadd") {
            setSupabaseUser(session.user);
            setPortalType(userPortalType);
          } else {
            setSupabaseUser(null);
            setPortalType(null);
          }
        } else {
          setSupabaseUser(null);
          setPortalType(null);
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
        setSupabaseUser(null);
        setPortalType(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userPortalType = session.user.user_metadata?.portal_type;
        if (userPortalType === "admission" || userPortalType === "accadd") {
          setSupabaseUser(session.user);
          setPortalType(userPortalType);
        } else {
          setSupabaseUser(null);
          if (portalType === "admission" || portalType === "accadd") {
            setPortalType(null);
          }
        }
      } else {
        // Only clear if it's a Supabase portal
        if (portalType === "admission" || portalType === "accadd") {
          setSupabaseUser(null);
          setPortalType(null);
        }
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [portalType]);

  const login = async (email: string, password: string) => {
    try {
      // Clear portal type immediately to prevent showing old portal
      setPortalType(null);
      setStudentUser(null);
      setSupabaseUser(null);

      const response = await api.post("/auth/login", { email, password });
      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setStudentUser(userData);
      setPortalType("student");
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    targetPortalType: "admission" | "accadd"
  ) => {
    try {
      // Clear portal type immediately to prevent showing old portal
      setPortalType(null);
      setSupabaseUser(null);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            portal_type: targetPortalType,
          },
          emailRedirectTo: `${window.location.origin}/${
            targetPortalType === "accadd" ? "accadd/form" : "admission/portal"
          }`,
        },
      });

      if (signUpError) {
        return { user: null, session: null, error: signUpError };
      }

      if (data.user) {
        // Verify portal_type was set
        if (!data.user.user_metadata?.portal_type) {
          await supabase.auth.updateUser({
            data: {
              ...data.user.user_metadata,
              portal_type: targetPortalType,
            },
          });
        }

        setSupabaseUser(data.user);
        setPortalType(targetPortalType);
      }

      return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
      console.error("Sign up error:", error);
      return { user: null, session: null, error };
    }
  };

  const signIn = async (
    email: string,
    password: string,
    targetPortalType: "admission" | "accadd"
  ) => {
    try {
      // Clear portal type immediately to prevent showing old portal
      setPortalType(null);
      setSupabaseUser(null);

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        return { user: null, error: signInError };
      }

      if (data.user) {
        // Always update portal_type to the current portal being accessed
        // This allows the same email to be used across different portals
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            ...data.user.user_metadata,
            portal_type: targetPortalType,
          },
        });

        if (updateError) {
          console.error("Error updating user metadata:", updateError);
        } else {
          // Refresh session to get updated metadata
          await supabase.auth.refreshSession();
        }

        setSupabaseUser(data.user);
        setPortalType(targetPortalType);
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      return { user: null, error };
    }
  };

  const logout = async () => {
    try {
      // Clear all state immediately to prevent UI flash
      setPortalType(null);
      setSupabaseUser(null);
      setToken(null);
      setStudentUser(null);

      // Clear localStorage (for legacy student JWT if present)
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
      // Ensure state is cleared even on error
      setPortalType(null);
      setSupabaseUser(null);
      setToken(null);
      setStudentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        studentUser,
        token,
        login,
        supabaseUser,
        signUp,
        signIn,
        logout,
        isAuthenticated: !!portalType,
        loading,
        portalType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
