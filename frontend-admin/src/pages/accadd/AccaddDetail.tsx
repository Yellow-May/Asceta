import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

interface UserDetails {
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
  application: {
    id: string;
    surname: string;
    fullName: string;
    sex: string;
    maritalStatus: string;
    dateOfBirth: string;
    stateOfOrigin: string;
    localGovernmentArea: string;
    permanentHomeAddress: string;
    nextOfKin: {
      name: string;
      relationship: string;
      phone: string;
      address: string;
    };
    phone: string;
    passportPhoto: {
      url: string;
      public_id: string;
    };
    status: string;
    submittedAt: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  payments: Array<{
    id: string;
    status: string;
    amount: number;
    paymentData: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  }>;
}

const AccaddDetail = () => {
  const { supabaseUserId } = useParams<{ supabaseUserId: string }>();
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!supabaseUserId) {
        setError("User ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/accadd/admin/users/${supabaseUserId}`);
        setDetails(response.data);
      } catch (err: any) {
        console.error("Error fetching user details:", err);
        setError(err.response?.data?.message || "Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [supabaseUserId]);

  const getStageLabel = (stage: string) => {
    const stageLabels: Record<string, string> = {
      registered: "Registered",
      application_submitted: "Application Submitted",
      under_review: "Under Review",
      approved: "Approved",
      rejected: "Rejected",
    };
    return stageLabels[stage] || stage;
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      registered: "bg-gray-100 text-gray-800",
      application_submitted: "bg-blue-100 text-blue-800",
      under_review: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
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
          <p className="text-red-800">{error || "User not found"}</p>
          <Link
            to="/accadd"
            className="text-admin-blue hover:underline mt-2 inline-block"
          >
            ← Back to ACCADD List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/accadd"
          className="text-admin-blue hover:underline mb-4 inline-block"
        >
          ← Back to ACCADD List
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          ACCADD Application Details
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
              Email Verified
            </label>
            <p className="text-gray-900">
              {details.user.isEmailVerified ? (
                <span className="text-green-600">Yes</span>
              ) : (
                <span className="text-red-600">No</span>
              )}
            </p>
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
                Full Name
              </label>
              <p className="text-gray-900">{details.application.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Sex</label>
              <p className="text-gray-900">{details.application.sex}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Marital Status
              </label>
              <p className="text-gray-900">
                {details.application.maritalStatus}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Date of Birth
              </label>
              <p className="text-gray-900">
                {new Date(details.application.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
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
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">
                Permanent Home Address
              </label>
              <p className="text-gray-900">
                {details.application.permanentHomeAddress}
              </p>
            </div>
          </div>

          {/* Next of Kin */}
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
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Address
                </label>
                <p className="text-gray-900">
                  {details.application.nextOfKin.address}
                </p>
              </div>
            </div>
          </div>

          {/* Passport Photo */}
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

          {/* Application Status */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Application Status
                </label>
                <p>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      details.application.status === "submitted"
                        ? "bg-blue-100 text-blue-800"
                        : details.application.status === "under_review"
                        ? "bg-yellow-100 text-yellow-800"
                        : details.application.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {details.application.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Submitted At
                </label>
                <p className="text-gray-900">
                  {details.application.submittedAt
                    ? new Date(details.application.submittedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-gray-500">No application submitted yet.</p>
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

export default AccaddDetail;
