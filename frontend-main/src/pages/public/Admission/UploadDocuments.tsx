import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../../../config/supabase";
import api from "../../../services/api";

interface DocumentUpload {
  documentType: string;
  file: File | null;
  preview: string;
  uploaded: boolean;
  url?: string;
}

const UploadDocuments = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    {
      documentType: "passport_photo",
      file: null,
      preview: "",
      uploaded: false,
    },
    {
      documentType: "olevel_first",
      file: null,
      preview: "",
      uploaded: false,
    },
    {
      documentType: "jamb_result",
      file: null,
      preview: "",
      uploaded: false,
    },
    {
      documentType: "birth_certificate",
      file: null,
      preview: "",
      uploaded: false,
    },
    {
      documentType: "lga_identification",
      file: null,
      preview: "",
      uploaded: false,
    },
  ]);

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
    };
    checkAuth();
  }, [navigate]);

  const getDocumentLabel = (type: string): string => {
    const labels: Record<string, string> = {
      passport_photo: "Passport Photograph",
      olevel_first: "O'Level Result (First Sitting)",
      olevel_second: "O'Level Result (Second Sitting)",
      jamb_result: "JAMB Result Slip",
      birth_certificate: "Birth Certificate / Age Declaration",
      lga_identification: "Local Government Identification",
    };
    return labels[type] || type;
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.documentType === documentType
            ? {
                ...doc,
                file,
                preview: reader.result as string,
              }
            : doc
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (documentType: string) => {
    const document = documents.find((doc) => doc.documentType === documentType);
    if (!document || !document.file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(documentType);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expired. Please login again.");
        navigate("/admission/auth");
        return;
      }
      // Verify user belongs to admission portal
      const portalType = session.user.user_metadata?.portal_type;
      if (portalType !== "admission") {
        toast.error("Invalid portal access.");
        if (portalType === "accadd") {
          navigate("/accadd/form");
        } else {
          navigate("/admission/auth");
        }
        return;
      }

      const formData = new FormData();
      formData.append("file", document.file);
      formData.append("supabaseUserId", session.user.id);
      formData.append("email", session.user.email || "");
      formData.append("documentType", documentType);

      await api.post(
        "/admission-portal/application/upload-document",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(`${getDocumentLabel(documentType)} uploaded successfully!`);
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.documentType === documentType ? { ...doc, uploaded: true } : doc
        )
      );
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast.error(
        error.response?.data?.message ||
          `Failed to upload ${getDocumentLabel(documentType)}`
      );
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <Link
              to="/admission/portal"
              className="text-asceta-blue hover:underline mb-4 inline-block"
            >
              ← Back to Portal
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Upload Documents
            </h1>
            <p className="mt-2 text-gray-600">
              Upload all required documents for your admission application
            </p>
          </div>

          <div className="space-y-6">
            {documents.map((document) => (
              <div
                key={document.documentType}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getDocumentLabel(document.documentType)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {document.documentType === "passport_photo"
                        ? "Upload a clear passport-sized photograph"
                        : "Upload a scanned copy or clear photo"}
                    </p>
                  </div>
                  {document.uploaded && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      Uploaded
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <input
                      type="file"
                      accept={
                        document.documentType === "passport_photo"
                          ? "image/*"
                          : "image/*,application/pdf"
                      }
                      onChange={(e) =>
                        handleFileChange(e, document.documentType)
                      }
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-asceta-blue file:text-white hover:file:bg-blue-700"
                    />
                  </div>

                  {document.preview && (
                    <div className="mt-4">
                      {document.documentType === "passport_photo" ? (
                        <img
                          src={document.preview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                      ) : (
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">
                            File selected: {document.file?.name}
                          </p>
                          {document.file?.type.startsWith("image/") && (
                            <img
                              src={document.preview}
                              alt="Preview"
                              className="mt-2 max-w-xs max-h-48 object-contain rounded-lg border border-gray-300"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleUpload(document.documentType)}
                    disabled={
                      !document.file || uploading === document.documentType
                    }
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      !document.file || uploading === document.documentType
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-asceta-blue text-white hover:bg-blue-700"
                    }`}
                  >
                    {uploading === document.documentType
                      ? "Uploading..."
                      : document.uploaded
                      ? "Re-upload"
                      : "Upload"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Link
              to="/admission/portal"
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Back to Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;
