import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

interface ApplicationDetails {
  user: {
    id: string;
    email: string;
    fullName: string;
    supabaseUserId: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  stage: string;
  application: any;
  payments: Array<{
    id: string;
    status: string;
    amount: number;
    paymentType: string;
    createdAt: string;
    updatedAt: string;
  }>;
  documents: Array<{
    id: string;
    documentType: string;
    file: {
      url: string;
      public_id: string;
    };
    uploadedAt: string;
  }>;
}

const AdmissionDetail = () => {
  const { supabaseUserId } = useParams<{ supabaseUserId: string }>();
  const [details, setDetails] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    assignedCourse: { program: "", department: "" },
    reviewNotes: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      if (!supabaseUserId) {
        setError("User ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(
          `/admission-portal/admin/applications/${supabaseUserId}`
        );
        setDetails(response.data);
        if (response.data.application) {
          setStatusUpdate({
            status: response.data.application.status || "",
            assignedCourse: response.data.application.assignedCourse || {
              program: "",
              department: "",
            },
            reviewNotes: response.data.application.reviewNotes || "",
          });
        }
      } catch (err: any) {
        console.error("Error fetching application details:", err);
        setError(
          err.response?.data?.message || "Failed to load application details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [supabaseUserId]);

  const handleStatusUpdate = async () => {
    if (!details?.application) return;

    setUpdatingStatus(true);
    try {
      await api.put(
        `/admission-portal/admin/applications/${details.application._id}/status`,
        {
          status: statusUpdate.status,
          assignedCourse: statusUpdate.assignedCourse,
          reviewNotes: statusUpdate.reviewNotes,
          reviewedBy: "Admin", // TODO: Get from auth context
        }
      );
      alert("Status updated successfully!");
      // Reload details
      const response = await api.get(
        `/admission-portal/admin/applications/${supabaseUserId}`
      );
      setDetails(response.data);
    } catch (err: any) {
      console.error("Error updating status:", err);
      alert(
        "Failed to update status: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStageLabel = (stage: string) => {
    const stageLabels: Record<string, string> = {
      registered: "Registered",
      application_submitted: "Application Submitted",
      under_review: "Under Review",
      admitted: "Admitted",
      rejected: "Rejected",
    };
    return stageLabels[stage] || stage;
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      registered: "bg-gray-100 text-gray-800",
      application_submitted: "bg-blue-100 text-blue-800",
      under_review: "bg-yellow-100 text-yellow-800",
      admitted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      not_initiated: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || "Application not found"}</p>
          <Link
            to="/admission"
            className="text-admin-blue hover:underline mt-2 inline-block"
          >
            ← Back to Admission List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/admission"
          className="text-admin-blue hover:underline mb-4 inline-block"
        >
          ← Back to Admission List
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          Admission Application Details
        </h1>
      </div>

      {/* User Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          User Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Full Name
            </label>
            <p className="text-gray-900">{details.user.fullName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{details.user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Current Stage
            </label>
            <p>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(
                  details.stage
                )}`}
              >
                {getStageLabel(details.stage)}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Registered Date
            </label>
            <p className="text-gray-900">
              {new Date(details.user.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Application Details */}
      {details.application ? (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Application Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Surname
                </label>
                <p className="text-gray-900">{details.application.surname}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  First Name
                </label>
                <p className="text-gray-900">{details.application.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Sex</label>
                <p className="text-gray-900">{details.application.sex}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Date of Birth
                </label>
                <p className="text-gray-900">
                  {new Date(
                    details.application.dateOfBirth
                  ).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone
                </label>
                <p className="text-gray-900">{details.application.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  State of Origin
                </label>
                <p className="text-gray-900">
                  {details.application.stateOfOrigin}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Local Government Area
                </label>
                <p className="text-gray-900">
                  {details.application.localGovernmentArea}
                </p>
              </div>
              {details.application.jambScore && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    JAMB Score
                  </label>
                  <p className="text-gray-900">
                    {details.application.jambScore}
                  </p>
                </div>
              )}
              {details.application.firstChoice && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    First Choice
                  </label>
                  <p className="text-gray-900">
                    {details.application.firstChoice.program} -{" "}
                    {details.application.firstChoice.department}
                  </p>
                </div>
              )}
            </div>

            {/* Next of Kin */}
            {details.application.nextOfKin && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Next of Kin Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Name
                    </label>
                    <p className="text-gray-900">
                      {details.application.nextOfKin.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Relationship
                    </label>
                    <p className="text-gray-900">
                      {details.application.nextOfKin.relationship}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="text-gray-900">
                      {details.application.nextOfKin.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Passport Photo */}
            {details.application.passportPhoto && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Passport Photo
                </h3>
                <div>
                  <img
                    src={details.application.passportPhoto.url}
                    alt="Passport"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status Update */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Update Application Status
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) =>
                    setStatusUpdate({ ...statusUpdate, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-blue"
                >
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="admitted">Admitted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {statusUpdate.status === "admitted" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned Program
                    </label>
                    <input
                      type="text"
                      value={statusUpdate.assignedCourse.program}
                      onChange={(e) =>
                        setStatusUpdate({
                          ...statusUpdate,
                          assignedCourse: {
                            ...statusUpdate.assignedCourse,
                            program: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-blue"
                      placeholder="e.g., NCE"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned Department
                    </label>
                    <input
                      type="text"
                      value={statusUpdate.assignedCourse.department}
                      onChange={(e) =>
                        setStatusUpdate({
                          ...statusUpdate,
                          assignedCourse: {
                            ...statusUpdate.assignedCourse,
                            department: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-blue"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes
                </label>
                <textarea
                  value={statusUpdate.reviewNotes}
                  onChange={(e) =>
                    setStatusUpdate({
                      ...statusUpdate,
                      reviewNotes: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-blue"
                  placeholder="Add any notes or comments..."
                />
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={updatingStatus}
                className={`px-6 py-2 bg-admin-blue text-white rounded-md hover:bg-admin-dark-blue ${
                  updatingStatus ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {updatingStatus ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-gray-500">No application submitted yet.</p>
        </div>
      )}

      {/* Documents */}
      {details.documents && details.documents.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Uploaded Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details.documents.map((doc) => (
              <div
                key={doc.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {doc.documentType.replace(/_/g, " ").toUpperCase()}
                </h3>
                <a
                  href={doc.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-admin-blue hover:underline"
                >
                  View Document
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Payment History
        </h2>
        {details.payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {details.payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paymentType === "application_fee"
                        ? "Application Fee"
                        : payment.paymentType === "acceptance_fee"
                        ? "Acceptance Fee"
                        : payment.paymentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No payment records found.</p>
        )}
      </div>
    </div>
  );
};

export default AdmissionDetail;
