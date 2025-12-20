import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../../../config/supabase";
import api from "../../../services/api";
import { ensureAdmissionUserExists } from "../../../utils/admissionAuth";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admission/auth");
        return;
      }
      // Verify user belongs to admission portal
      const portalType = session.user.user_metadata?.portal_type;
      if (portalType !== "admission") {
        if (portalType === "accadd") {
          navigate("/accadd/form");
        } else {
          navigate("/admission/auth");
        }
        return;
      }
      await ensureAdmissionUserExists();
      setUserEmail(session.user.email || "");
      await fetchPaymentHistory(session.user.email || "");
    };
    checkAuth();
  }, [navigate]);

  const fetchPaymentHistory = async (email: string) => {
    try {
      const response = await api.get(
        `/admission-portal/payment/status/${email}`
      );
      setPaymentHistory(response.data.payments || []);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error("Error fetching payment history:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }
      // Verify user belongs to admission portal
      const portalType = session.user.user_metadata?.portal_type;
      if (portalType !== "admission") {
        throw new Error("Invalid portal access");
      }

      await api.post("/admission-portal/payment/initiate", {
        email: session.user.email,
        supabaseUserId: session.user.id,
        paymentType: "application_fee",
        amount: 0, // TBD - will be set by admin
        paymentData: {},
      });

      toast.success("Payment initiated successfully!");
      setTimeout(() => navigate("/admission/portal"), 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            to="/admission/portal"
            className="text-asceta-blue hover:underline mb-4 inline-block"
          >
            ← Back to Portal
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Application Payment
          </h2>
          <p className="mt-2 text-gray-600">
            Complete your payment to proceed with your application
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-asceta-blue text-white p-6">
            <h3 className="text-xl font-bold mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Application Fee:</span>
                <span className="font-semibold">TBD</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-white border-opacity-30 pt-2 mt-2">
                <span>Total:</span>
                <span>TBD</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> Payment functionality is currently
                    being set up. This is a placeholder page for the payment
                    process.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Applicant Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {userEmail}
                </p>
              </div>
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

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/admission/portal")}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-asceta-blue hover:bg-blue-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : "Initiate Payment"}
              </button>
            </div>
          </form>
        </div>

        {/* Payment History */}
        {paymentHistory.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Payment History
            </h3>
            <div className="space-y-4">
              {paymentHistory.map((payment, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {payment.paymentType === "application_fee"
                          ? "Application Fee"
                          : payment.paymentType === "acceptance_fee"
                          ? "Acceptance Fee"
                          : payment.paymentType}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₦{payment.amount.toLocaleString()}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
