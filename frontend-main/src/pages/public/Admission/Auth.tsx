import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";
import { ensureAdmissionUserExists } from "../../../utils/admissionAuth";

const Auth = () => {
  const { signUp, signIn, portalType } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    if (portalType === "admission") {
      navigate("/admission/portal");
    } else if (portalType === "accadd") {
      navigate("/accadd/form");
    }
  }, [portalType, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setError("Full name is required");
          setLoading(false);
          return;
        }

        const {
          user,
          session,
          error: signUpError,
        } = await signUp(email, password, fullName, "admission");

        if (signUpError) throw signUpError;

        if (user) {
          try {
            await api.post("/admission-portal/auth/register", {
              supabaseUserId: user.id,
              email: user.email,
              fullName: fullName,
            });
          } catch (apiError: any) {
            console.error("Error storing user data in MongoDB:", apiError);
            if (
              apiError.code === "ERR_NETWORK" ||
              apiError.message === "Network Error" ||
              apiError.message?.includes("Failed to fetch")
            ) {
              setError(
                "Cannot connect to server. Please make sure the backend server is running."
              );
            } else {
              console.warn(
                "MongoDB registration failed, but Supabase signup succeeded"
              );
            }
          }

          setSuccess(
            "Account created! Please check your email to verify your account."
          );
          setLoading(false);

          if (session) {
            setTimeout(() => navigate("/admission/portal"), 2000);
          }
          return;
        }
      } else {
        const { user, error: signInError } = await signIn(
          email,
          password,
          "admission"
        );

        if (signInError) {
          setLoading(false);
          throw signInError;
        }

        if (user) {
          setSuccess("Sign in successful! Redirecting...");
          setLoading(false);

          // Ensure user exists in background (non-blocking)
          ensureAdmissionUserExists().catch((err) => {
            console.error("Error ensuring user exists:", err);
          });

          setTimeout(() => navigate("/admission/portal"), 1500);
          return;
        } else {
          throw new Error("Sign in failed. Please try again.");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (
        err.message?.includes("ERR_NAME_NOT_RESOLVED") ||
        err.message?.includes("Failed to fetch")
      ) {
        if (
          err.message?.includes("supabase.co") ||
          err.code === "ERR_NAME_NOT_RESOLVED"
        ) {
          setError(
            "Cannot connect to Supabase. Please check your Supabase URL in the .env file."
          );
        } else {
          setError(
            "Cannot connect to server. Please make sure the backend server is running at http://localhost:5000"
          );
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Post-UTME Admission Portal
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                placeholder={
                  isSignUp
                    ? "Create a password (min. 6 characters)"
                    : "Enter your password"
                }
                minLength={6}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-asceta-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-asceta-blue ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                  setSuccess("");
                  setFullName("");
                  setEmail("");
                  setPassword("");
                }}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-asceta-blue"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/admission"
            className="text-sm text-asceta-blue hover:underline"
          >
            ← Back to Admission Information
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
