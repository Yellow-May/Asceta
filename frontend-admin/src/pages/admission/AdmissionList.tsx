import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

interface AdmissionApplication {
  id: string;
  email: string;
  fullName: string;
  supabaseUserId: string;
  isEmailVerified: boolean;
  stage: string;
  hasApplication: boolean;
  applicationStatus: string | null;
  applicationSubmittedAt: string | null;
  paymentStatus: string;
  paymentAmount: number;
  paymentCreatedAt: string | null;
  createdAt: string;
}

const AdmissionList = () => {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "registered" | "application_submitted" | "under_review" | "admitted"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admission-portal/admin/applications");
        setApplications(response.data.applications || []);
      } catch (error) {
        console.error("Error fetching admission applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "all" || app.stage === filter;
    const matchesSearch =
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Admission Applications
        </h1>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all"
                ? "bg-admin-blue text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("registered")}
            className={`px-4 py-2 rounded ${
              filter === "registered"
                ? "bg-admin-blue text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Registered Only
          </button>
          <button
            onClick={() => setFilter("application_submitted")}
            className={`px-4 py-2 rounded ${
              filter === "application_submitted"
                ? "bg-admin-blue text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Application Submitted
          </button>
          <button
            onClick={() => setFilter("under_review")}
            className={`px-4 py-2 rounded ${
              filter === "under_review"
                ? "bg-admin-blue text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Under Review
          </button>
          <button
            onClick={() => setFilter("admitted")}
            className={`px-4 py-2 rounded ${
              filter === "admitted"
                ? "bg-admin-blue text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Admitted
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-blue"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Application Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Registered Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {app.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{app.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(
                          app.stage
                        )}`}
                      >
                        {getStageLabel(app.stage)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.hasApplication ? (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            app.applicationStatus === "submitted"
                              ? "bg-blue-100 text-blue-800"
                              : app.applicationStatus === "under_review"
                              ? "bg-yellow-100 text-yellow-800"
                              : app.applicationStatus === "admitted"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {app.applicationStatus || "N/A"}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Not submitted
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
                          app.paymentStatus
                        )}`}
                      >
                        {app.paymentStatus === "not_initiated"
                          ? "Not Initiated"
                          : app.paymentStatus}
                      </span>
                      {app.paymentAmount > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          ₦{app.paymentAmount.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/admission/${app.supabaseUserId}`}
                        className="text-admin-blue hover:text-admin-dark-blue"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || filter !== "all"
                ? "No applications found matching your criteria"
                : "No applications found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdmissionList;
