import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

interface ApplicationStatus {
  status: string;
  hasApplication: boolean;
  hasDocuments: boolean;
  hasPayment: boolean;
}

const Portal = () => {
  const { supabaseUser, portalType, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appStatus, setAppStatus] = useState<ApplicationStatus>({
    status: "pending",
    hasApplication: false,
    hasDocuments: false,
    hasPayment: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (portalType !== "admission") {
        navigate("/admission/auth");
        return;
      }
      await fetchApplicationStatus();
    };
    checkAuth();
  }, [portalType, navigate]);

  const fetchApplicationStatus = async () => {
    try {
      if (!supabaseUser) return;

      const response = await api.get(
        `/admission-portal/application/${supabaseUser.id}`
      );
      const application = response.data.application;

      const paymentResponse = await api.get(
        `/admission-portal/payment/status/${supabaseUser.email}`
      );
      const payments = paymentResponse.data.payments || [];

      setAppStatus({
        status: application?.status || "pending",
        hasApplication: !!application,
        hasDocuments: !!application?.passportPhoto,
        hasPayment: payments.some((p: any) => p.status === "completed"),
      });
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error("Error fetching application status:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "admitted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "admitted":
        return "Admitted";
      case "rejected":
        return "Not Admitted";
      case "under_review":
        return "Under Review";
      case "submitted":
        return "Application Submitted";
      default:
        return "Not Started";
    }
  };

  const steps = [
    {
      id: 1,
      name: "Register",
      completed: true,
      current: false,
    },
    {
      id: 2,
      name: "Fill Application Form",
      completed: appStatus.hasApplication,
      current: !appStatus.hasApplication,
    },
    {
      id: 3,
      name: "Upload Documents",
      completed: appStatus.hasDocuments,
      current: appStatus.hasApplication && !appStatus.hasDocuments,
    },
    {
      id: 4,
      name: "Make Payment",
      completed: appStatus.hasPayment,
      current:
        appStatus.hasApplication &&
        appStatus.hasDocuments &&
        !appStatus.hasPayment,
    },
    {
      id: 5,
      name: "Await Decision",
      completed:
        appStatus.status === "admitted" || appStatus.status === "rejected",
      current:
        appStatus.hasPayment &&
        appStatus.status !== "admitted" &&
        appStatus.status !== "rejected",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-asceta-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admission Portal
              </h1>
              <p className="mt-1 text-gray-600">
                Welcome, {supabaseUser?.user_metadata?.full_name || supabaseUser?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Status Banner */}
        {appStatus.status !== "pending" && (
          <div
            className={`rounded-lg p-4 mb-6 ${getStatusColor(
              appStatus.status
            )}`}
          >
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold">
                Application Status: {getStatusLabel(appStatus.status)}
              </span>
            </div>
          </div>
        )}

        {/* Progress Tracker */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Application Progress
          </h2>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step.completed
                        ? "bg-green-500 text-white"
                        : step.current
                        ? "bg-asceta-blue text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.completed ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <p className="mt-2 text-xs text-center text-gray-600">
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step.completed ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admission/application"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">
                {appStatus.hasApplication
                  ? "Edit Application"
                  : "Fill Application Form"}
              </h3>
            </div>
            <p className="text-gray-600">
              {appStatus.hasApplication
                ? "Update your application information"
                : "Complete your admission application form"}
            </p>
          </Link>

          <Link
            to="/admission/documents"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">
                Upload Documents
              </h3>
            </div>
            <p className="text-gray-600">
              Upload required documents (O'Level results, passport photo, etc.)
            </p>
          </Link>

          <Link
            to="/admission/payment"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">
                Make Payment
              </h3>
            </div>
            <p className="text-gray-600">
              Pay application fee and other charges
            </p>
          </Link>

          <Link
            to="/admission/status"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">
                View Status
              </h3>
            </div>
            <p className="text-gray-600">
              Check your application status and admission results
            </p>
          </Link>

          {appStatus.status === "admitted" && (
            <Link
              to="/admission/status"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">
                  Download Admission Letter
                </h3>
              </div>
              <p className="text-gray-600">
                Download your admission letter and other documents
              </p>
            </Link>
          )}
        </div>

        {/* Important Dates */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Important Dates
          </h2>
          <div className="space-y-2 text-gray-600">
            <p>Application Deadline: To be announced</p>
            <p>Payment Deadline: To be announced</p>
            <p>Admission List Release: To be announced</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portal;
