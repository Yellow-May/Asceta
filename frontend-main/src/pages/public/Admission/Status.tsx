import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../config/supabase";
import api from "../../../services/api";

const Status = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState("");

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
      await fetchApplicationStatus(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  const fetchApplicationStatus = async (supabaseUserId: string) => {
    try {
      const response = await api.get(
        `/admission-portal/application/${supabaseUserId}`
      );
      setApplication(response.data.application);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("No application found. Please submit an application first.");
      } else {
        setError("Failed to load application status.");
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
        return "Pending";
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-red-800">{error}</p>
            </div>
            <div className="mt-6">
              <Link
                to="/admission/portal"
                className="text-asceta-blue hover:underline"
              >
                ← Back to Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/admission/portal"
            className="text-asceta-blue hover:underline mb-4 inline-block"
          >
            ← Back to Portal
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Application Status
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Current Status
            </h2>
            <span
              className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                application?.status || "pending"
              )}`}
            >
              {getStatusLabel(application?.status || "pending")}
            </span>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                </div>
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">
                  Application Submitted
                </p>
                <p className="text-sm text-gray-600">
                  {application?.submittedAt
                    ? new Date(application.submittedAt).toLocaleString()
                    : "Not yet submitted"}
                </p>
              </div>
            </div>

            {application?.status === "under_review" && (
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Under Review</p>
                  <p className="text-sm text-gray-600">
                    Your application is being reviewed by the admissions office
                  </p>
                </div>
              </div>
            )}

            {application?.status === "admitted" && (
              <>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
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
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">
                      Admission Approved
                    </p>
                    <p className="text-sm text-gray-600">
                      {application?.reviewedAt
                        ? new Date(application.reviewedAt).toLocaleString()
                        : "Congratulations! You have been admitted."}
                    </p>
                  </div>
                </div>

                {application?.assignedCourse && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
                    <h3 className="font-semibold text-green-900 mb-2">
                      Assigned Course
                    </h3>
                    <p className="text-green-800">
                      <strong>Program:</strong>{" "}
                      {application.assignedCourse.program}
                    </p>
                    <p className="text-green-800">
                      <strong>Department:</strong>{" "}
                      {application.assignedCourse.department}
                    </p>
                  </div>
                )}
              </>
            )}

            {application?.status === "rejected" && (
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Not Admitted</p>
                  <p className="text-sm text-gray-600">
                    {application?.reviewNotes ||
                      "Unfortunately, your application was not successful."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Application Details */}
        {application && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Application Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-gray-900">
                  {application.surname} {application.middleName}{" "}
                  {application.firstName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-gray-900">{application.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone
                </label>
                <p className="text-gray-900">{application.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  First Choice
                </label>
                <p className="text-gray-900">
                  {application.firstChoice?.program} -{" "}
                  {application.firstChoice?.department}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Download Admission Letter */}
        {application?.status === "admitted" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Next Steps
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Congratulations on your admission! Please download your
                admission letter and follow the instructions provided.
              </p>
              <button
                onClick={() => {
                  // TODO: Implement download functionality
                  alert("Download functionality will be implemented soon");
                }}
                className="px-6 py-2 bg-asceta-blue text-white rounded-md hover:bg-blue-700"
              >
                Download Admission Letter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Status;
