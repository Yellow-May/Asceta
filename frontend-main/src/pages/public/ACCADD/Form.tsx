import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../../../config/supabase";
import api from "../../../services/api";
import { ensureUserExists } from "../../../utils/accaddAuth";
import FullScreenLoader from "../../../components/FullScreenLoader";

interface FormData {
  surname: string;
  fullName: string;
  sex: "Male" | "Female" | "Other" | "";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed" | "";
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
  email: string;
}

const Form = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [passportPreview, setPassportPreview] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    surname: "",
    fullName: "",
    sex: "",
    maritalStatus: "",
    dateOfBirth: "",
    stateOfOrigin: "",
    localGovernmentArea: "",
    permanentHomeAddress: "",
    nextOfKin: {
      name: "",
      relationship: "",
      phone: "",
      address: "",
    },
    phone: "",
    email: "",
  });

  useEffect(() => {
    // Check if user is authenticated and prefill form data
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/accadd/auth");
      } else {
        // Ensure user exists in MongoDB (sync check)
        await ensureUserExists();

        // Try to fetch existing application first
        try {
          const response = await api.get(
            `/accadd/application/${session.user.id}`
          );
          if (response.data?.application) {
            const app = response.data.application;
            setHasExistingApplication(true);
            setFormData((prev) => ({
              ...prev,
              email: app.email || session.user.email || "",
              surname: app.surname || "",
              fullName: app.fullName || "",
              sex: app.sex || "",
              maritalStatus: app.maritalStatus || "",
              dateOfBirth: app.dateOfBirth
                ? new Date(app.dateOfBirth).toISOString().split("T")[0]
                : "",
              stateOfOrigin: app.stateOfOrigin || "",
              localGovernmentArea: app.localGovernmentArea || "",
              permanentHomeAddress: app.permanentHomeAddress || "",
              nextOfKin: app.nextOfKin || {
                name: "",
                relationship: "",
                phone: "",
                address: "",
              },
              phone: app.phone || "",
            }));

            // If passport photo exists, set preview
            if (app.passportPhoto?.url) {
              setPassportPreview(app.passportPhoto.url);
            }
            return;
          }
        } catch (error: any) {
          // If no application exists (404), continue to use user metadata
          if (error.response?.status !== 404) {
            console.error("Error fetching application:", error);
          }
          setHasExistingApplication(false);
        }

        // If no application exists, use Supabase user metadata
        const fullNameFromMetadata =
          session.user.user_metadata?.full_name || "";

        // Extract surname (last word) and keep fullName
        let surname = "";
        let fullName = fullNameFromMetadata;

        if (fullNameFromMetadata) {
          const nameParts = fullNameFromMetadata.trim().split(/\s+/);
          if (nameParts.length > 0) {
            // Surname is typically the last word in Nigerian names
            surname = nameParts[nameParts.length - 1];
            // Full name remains the complete name
            fullName = fullNameFromMetadata;
          }
        }

        setFormData((prev) => ({
          ...prev,
          email: session.user.email || "",
          surname: surname,
          fullName: fullName,
        }));
      }
    };
    checkAuth();
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("nextOfKin.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        nextOfKin: {
          ...prev.nextOfKin,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setPassportPhoto(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.surname.trim()) {
      toast.error("Surname is required");
      return false;
    }
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.sex) {
      toast.error("Sex is required");
      return false;
    }
    if (!formData.maritalStatus) {
      toast.error("Marital status is required");
      return false;
    }
    if (!formData.dateOfBirth) {
      toast.error("Date of birth is required");
      return false;
    }
    // Validate minimum age of 16 years
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Calculate exact age
    let exactAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      exactAge--;
    }

    if (exactAge < 16) {
      toast.error("You must be at least 16 years old to apply");
      return false;
    }
    if (!formData.stateOfOrigin.trim()) {
      toast.error("State of origin is required");
      return false;
    }
    if (!formData.localGovernmentArea.trim()) {
      toast.error("Local Government Area is required");
      return false;
    }
    if (!formData.permanentHomeAddress.trim()) {
      toast.error("Permanent home address is required");
      return false;
    }
    if (!formData.nextOfKin.name.trim()) {
      toast.error("Next of kin name is required");
      return false;
    }
    if (!formData.nextOfKin.relationship.trim()) {
      toast.error("Next of kin relationship is required");
      return false;
    }
    if (!formData.nextOfKin.phone.trim()) {
      toast.error("Next of kin phone is required");
      return false;
    }
    if (!formData.nextOfKin.address.trim()) {
      toast.error("Next of kin address is required");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!passportPhoto) {
      toast.error("Passport photo is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("supabaseUserId", session.user.id);
      submitData.append("email", formData.email);
      submitData.append("surname", formData.surname);
      submitData.append("fullName", formData.fullName);
      submitData.append("sex", formData.sex);
      submitData.append("maritalStatus", formData.maritalStatus);
      submitData.append("dateOfBirth", formData.dateOfBirth);
      submitData.append("stateOfOrigin", formData.stateOfOrigin);
      submitData.append("localGovernmentArea", formData.localGovernmentArea);
      submitData.append("permanentHomeAddress", formData.permanentHomeAddress);
      submitData.append("nextOfKin", JSON.stringify(formData.nextOfKin));
      submitData.append("phone", formData.phone);
      if (passportPhoto) {
        submitData.append("passportPhoto", passportPhoto);
      }

      // Submit application
      await api.post("/accadd/application/submit", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (hasExistingApplication) {
        toast.success(
          "Application updated successfully! Redirecting to payment..."
        );
      } else {
        toast.success(
          "Application submitted successfully! Redirecting to payment..."
        );
      }
      setTimeout(() => {
        navigate("/accadd/payment");
      }, 2000);
    } catch (err: any) {
      console.error("Form submission error:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate maximum date (16 years ago from today)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 16,
      today.getMonth(),
      today.getDate()
    );
    return maxDate.toISOString().split("T")[0];
  };

  // Nigerian states list
  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  return (
    <>
      <FullScreenLoader
        isLoading={loading}
        message={
          hasExistingApplication
            ? "Updating your application..."
            : "Submitting your application..."
        }
      />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ACCADD Application Form
              </h1>
              <p className="text-gray-600">
                Please fill out all fields accurately
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="surname"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Surname <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      required
                      value={formData.surname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sex"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Sex <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="sex"
                      name="sex"
                      required
                      value={formData.sex}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="maritalStatus"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Marital Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="maritalStatus"
                      name="maritalStatus"
                      required
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    >
                      <option value="">Select...</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      required
                      max={getMaxDate()}
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      You must be at least 16 years old
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., 08012345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      disabled
                      value={formData.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Origin Information */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Origin Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="stateOfOrigin"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      State of Origin <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="stateOfOrigin"
                      name="stateOfOrigin"
                      required
                      value={formData.stateOfOrigin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    >
                      <option value="">Select State...</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="localGovernmentArea"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Local Government Area{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="localGovernmentArea"
                      name="localGovernmentArea"
                      required
                      value={formData.localGovernmentArea}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="permanentHomeAddress"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Permanent Home Address{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="permanentHomeAddress"
                      name="permanentHomeAddress"
                      required
                      rows={3}
                      value={formData.permanentHomeAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Next of Kin */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Next of Kin Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="nextOfKin.name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nextOfKin.name"
                      name="nextOfKin.name"
                      required
                      value={formData.nextOfKin.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nextOfKin.relationship"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Relationship <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nextOfKin.relationship"
                      name="nextOfKin.relationship"
                      required
                      value={formData.nextOfKin.relationship}
                      onChange={handleInputChange}
                      placeholder="e.g., Father, Mother, Spouse"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nextOfKin.phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="nextOfKin.phone"
                      name="nextOfKin.phone"
                      required
                      value={formData.nextOfKin.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., 08012345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="nextOfKin.address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="nextOfKin.address"
                      name="nextOfKin.address"
                      required
                      rows={3}
                      value={formData.nextOfKin.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Passport Photo */}
              <div className="pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Passport Photo
                </h2>
                <div>
                  <label
                    htmlFor="passportPhoto"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload Passport Photo{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Maximum file size: 5MB. Accepted formats: JPG, PNG, GIF
                  </p>
                  <input
                    type="file"
                    id="passportPhoto"
                    name="passportPhoto"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                  />
                  {passportPreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview:
                      </p>
                      <img
                        src={passportPreview}
                        alt="Passport preview"
                        className="w-32 h-32 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/accadd/auth")}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-asceta-blue"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-asceta-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-asceta-blue ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading
                    ? "Submitting..."
                    : hasExistingApplication
                    ? "Update Application →"
                    : "Submit Application →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
