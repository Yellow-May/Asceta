import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../../../config/supabase";
import api from "../../../services/api";
import { ensureAdmissionUserExists } from "../../../utils/admissionAuth";
import FullScreenLoader from "../../../components/FullScreenLoader";

interface OLevelSitting {
  examType: string;
  examNumber: string;
  examYear: string;
  subjects: Array<{ subject: string; grade: string }>;
}

interface FormData {
  // Personal Information
  surname: string;
  middleName: string;
  firstName: string;
  sex: "Male" | "Female" | "Other" | "";
  dateOfBirth: string;
  phone: string;
  stateOfOrigin: string;
  localGovernmentArea: string;
  permanentHomeAddress: string;
  // Educational Background
  jambScore: string;
  jambRegNo: string;
  oLevelFirstSitting: OLevelSitting;
  oLevelSecondSitting?: OLevelSitting;
  // Course Selection
  firstChoice: { program: string; department: string };
  secondChoice?: { program: string; department: string };
  // Next of Kin
  nextOfKin: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  };
  email: string;
}

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [passportPreview, setPassportPreview] = useState<string>("");
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    surname: "",
    middleName: "",
    firstName: "",
    sex: "",
    dateOfBirth: "",
    phone: "",
    stateOfOrigin: "",
    localGovernmentArea: "",
    permanentHomeAddress: "",
    jambScore: "",
    jambRegNo: "",
    oLevelFirstSitting: {
      examType: "",
      examNumber: "",
      examYear: "",
      subjects: [],
    },
    firstChoice: { program: "", department: "" },
    nextOfKin: {
      name: "",
      relationship: "",
      phone: "",
      address: "",
    },
    email: "",
  });

  const [hasSecondSitting, setHasSecondSitting] = useState(false);
  const [hasSecondChoice, setHasSecondChoice] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admission/auth");
      } else {
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

        try {
          const response = await api.get(
            `/admission-portal/application/${session.user.id}`
          );
          if (response.data?.application) {
            const app = response.data.application;
            setHasExistingApplication(true);
            setFormData((prev) => ({
              ...prev,
              email: app.email || session.user.email || "",
              surname: app.surname || "",
              middleName: app.middleName || "",
              firstName: app.firstName || "",
              sex: app.sex || "",
              dateOfBirth: app.dateOfBirth
                ? new Date(app.dateOfBirth).toISOString().split("T")[0]
                : "",
              phone: app.phone || "",
              stateOfOrigin: app.stateOfOrigin || "",
              localGovernmentArea: app.localGovernmentArea || "",
              permanentHomeAddress: app.permanentHomeAddress || "",
              jambScore: app.jambScore?.toString() || "",
              jambRegNo: app.jambRegNo || "",
              oLevelFirstSitting: app.oLevelFirstSitting || {
                examType: "",
                examNumber: "",
                examYear: "",
                subjects: [],
              },
              oLevelSecondSitting: app.oLevelSecondSitting,
              firstChoice: app.firstChoice || { program: "", department: "" },
              secondChoice: app.secondChoice,
              nextOfKin: app.nextOfKin || {
                name: "",
                relationship: "",
                phone: "",
                address: "",
              },
            }));

            if (app.oLevelSecondSitting) {
              setHasSecondSitting(true);
            }
            if (app.secondChoice) {
              setHasSecondChoice(true);
            }

            if (app.passportPhoto?.url) {
              setPassportPreview(app.passportPhoto.url);
            }
            return;
          }
        } catch (error: any) {
          if (error.response?.status !== 404) {
            console.error("Error fetching application:", error);
          }
          setHasExistingApplication(false);
        }

        const fullNameFromMetadata =
          session.user.user_metadata?.full_name || "";
        let surname = "";
        let firstName = "";

        if (fullNameFromMetadata) {
          const nameParts = fullNameFromMetadata.trim().split(/\s+/);
          if (nameParts.length > 0) {
            surname = nameParts[nameParts.length - 1];
            firstName = nameParts[0];
          }
        }

        setFormData((prev) => ({
          ...prev,
          email: session.user.email || "",
          surname: surname,
          firstName: firstName,
        }));
      }
    };
    checkAuth();
  }, [navigate]);

  // Auto-save to localStorage
  useEffect(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem("admissionFormData", JSON.stringify(formData));
    };
    saveToLocalStorage();
  }, [formData]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("admissionFormData");
    if (savedData && !hasExistingApplication) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Error loading saved form data:", e);
      }
    }
  }, []);

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
    } else if (name.startsWith("firstChoice.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        firstChoice: {
          ...prev.firstChoice,
          [field]: value,
        },
      }));
    } else if (name.startsWith("secondChoice.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        secondChoice: {
          ...(prev.secondChoice || { program: "", department: "" }),
          [field]: value,
        },
      }));
    } else if (name.startsWith("oLevelFirst.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        oLevelFirstSitting: {
          ...prev.oLevelFirstSitting,
          [field]: value,
        },
      }));
    } else if (name.startsWith("oLevelSecond.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        oLevelSecondSitting: {
          ...(prev.oLevelSecondSitting || {
            examType: "",
            examNumber: "",
            examYear: "",
            subjects: [],
          }),
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

  const handleSubjectChange = (
    index: number,
    field: "subject" | "grade",
    value: string,
    sitting: "first" | "second" = "first"
  ) => {
    setFormData((prev) => {
      const sittingData =
        sitting === "first"
          ? prev.oLevelFirstSitting
          : prev.oLevelSecondSitting || {
              examType: "",
              examNumber: "",
              examYear: "",
              subjects: [],
            };
      const newSubjects = [...sittingData.subjects];
      if (!newSubjects[index]) {
        newSubjects[index] = { subject: "", grade: "" };
      }
      newSubjects[index][field] = value;

      if (sitting === "first") {
        return {
          ...prev,
          oLevelFirstSitting: {
            ...sittingData,
            subjects: newSubjects,
          },
        };
      } else {
        return {
          ...prev,
          oLevelSecondSitting: {
            ...sittingData,
            subjects: newSubjects,
          },
        };
      }
    });
  };

  const addSubject = (sitting: "first" | "second" = "first") => {
    setFormData((prev) => {
      const sittingData =
        sitting === "first"
          ? prev.oLevelFirstSitting
          : prev.oLevelSecondSitting || {
              examType: "",
              examNumber: "",
              examYear: "",
              subjects: [],
            };
      return {
        ...prev,
        ...(sitting === "first"
          ? {
              oLevelFirstSitting: {
                ...sittingData,
                subjects: [...sittingData.subjects, { subject: "", grade: "" }],
              },
            }
          : {
              oLevelSecondSitting: {
                ...sittingData,
                subjects: [...sittingData.subjects, { subject: "", grade: "" }],
              },
            }),
      };
    });
  };

  const removeSubject = (
    index: number,
    sitting: "first" | "second" = "first"
  ) => {
    setFormData((prev) => {
      const sittingData =
        sitting === "first"
          ? prev.oLevelFirstSitting
          : prev.oLevelSecondSitting || {
              examType: "",
              examNumber: "",
              examYear: "",
              subjects: [],
            };
      const newSubjects = sittingData.subjects.filter((_, i) => i !== index);
      if (sitting === "first") {
        return {
          ...prev,
          oLevelFirstSitting: {
            ...sittingData,
            subjects: newSubjects,
          },
        };
      } else {
        return {
          ...prev,
          oLevelSecondSitting: {
            ...sittingData,
            subjects: newSubjects,
          },
        };
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setPassportPhoto(file);
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
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.sex) {
      toast.error("Sex is required");
      return false;
    }
    if (!formData.dateOfBirth) {
      toast.error("Date of birth is required");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
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
    if (
      !formData.oLevelFirstSitting.examType ||
      !formData.oLevelFirstSitting.examNumber ||
      !formData.oLevelFirstSitting.examYear
    ) {
      toast.error("O'Level first sitting information is required");
      return false;
    }
    if (formData.oLevelFirstSitting.subjects.length === 0) {
      toast.error("At least one O'Level subject is required");
      return false;
    }
    if (!formData.firstChoice.program || !formData.firstChoice.department) {
      toast.error("First choice program and department are required");
      return false;
    }
    if (
      !formData.nextOfKin.name ||
      !formData.nextOfKin.relationship ||
      !formData.nextOfKin.phone ||
      !formData.nextOfKin.address
    ) {
      toast.error("All next of kin information is required");
      return false;
    }
    if (!passportPhoto && !passportPreview) {
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
        toast.error(
          "Invalid portal access. Please login to the correct portal."
        );
        if (portalType === "accadd") {
          navigate("/accadd/form");
        } else {
          navigate("/admission/auth");
        }
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("supabaseUserId", session.user.id);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("middleName", formData.middleName);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("sex", formData.sex);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("stateOfOrigin", formData.stateOfOrigin);
      formDataToSend.append(
        "localGovernmentArea",
        formData.localGovernmentArea
      );
      formDataToSend.append(
        "permanentHomeAddress",
        formData.permanentHomeAddress
      );
      formDataToSend.append("jambScore", formData.jambScore || "");
      formDataToSend.append("jambRegNo", formData.jambRegNo || "");
      formDataToSend.append(
        "oLevelFirstSitting",
        JSON.stringify(formData.oLevelFirstSitting)
      );
      if (formData.oLevelSecondSitting) {
        formDataToSend.append(
          "oLevelSecondSitting",
          JSON.stringify(formData.oLevelSecondSitting)
        );
      }
      formDataToSend.append(
        "firstChoice",
        JSON.stringify(formData.firstChoice)
      );
      if (formData.secondChoice) {
        formDataToSend.append(
          "secondChoice",
          JSON.stringify(formData.secondChoice)
        );
      }
      formDataToSend.append("nextOfKin", JSON.stringify(formData.nextOfKin));

      if (passportPhoto) {
        formDataToSend.append("passportPhoto", passportPhoto);
      }

      await api.post("/admission-portal/application/submit", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        hasExistingApplication
          ? "Application updated successfully!"
          : "Application submitted successfully!"
      );
      localStorage.removeItem("admissionFormData");
      setTimeout(() => {
        navigate("/admission/portal");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while submitting the application."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <FullScreenLoader
        isLoading={loading}
        message="Submitting your application..."
      />
    );
  }

  const sections = [
    { id: 1, name: "Personal Information" },
    { id: 2, name: "Educational Background" },
    { id: 3, name: "Course Selection" },
    { id: 4, name: "Next of Kin" },
    { id: 5, name: "Review & Submit" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Admission Application Form
          </h1>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {sections.map((section, index) => (
                <div key={section.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => setCurrentSection(section.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentSection === section.id
                          ? "bg-asceta-blue text-white"
                          : currentSection > section.id
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentSection > section.id ? (
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
                        section.id
                      )}
                    </button>
                    <p className="mt-2 text-xs text-center text-gray-600">
                      {section.name}
                    </p>
                  </div>
                  {index < sections.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentSection > section.id
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Section 1: Personal Information */}
            {currentSection === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Surname *
                    </label>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sex *
                    </label>
                    <select
                      name="sex"
                      value={formData.sex}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State of Origin *
                    </label>
                    <input
                      type="text"
                      name="stateOfOrigin"
                      value={formData.stateOfOrigin}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Local Government Area *
                    </label>
                    <input
                      type="text"
                      name="localGovernmentArea"
                      value={formData.localGovernmentArea}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Permanent Home Address *
                  </label>
                  <textarea
                    name="permanentHomeAddress"
                    value={formData.permanentHomeAddress}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Passport Photograph *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-asceta-blue file:text-white hover:file:bg-blue-700"
                  />
                  {passportPreview && (
                    <div className="mt-4">
                      <img
                        src={passportPreview}
                        alt="Passport preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(2)}
                    className="px-6 py-2 bg-asceta-blue text-white rounded-md hover:bg-blue-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Section 2: Educational Background */}
            {currentSection === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Educational Background
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      JAMB Score
                    </label>
                    <input
                      type="number"
                      name="jambScore"
                      value={formData.jambScore}
                      onChange={handleInputChange}
                      min="0"
                      max="400"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      JAMB Registration Number
                    </label>
                    <input
                      type="text"
                      name="jambRegNo"
                      value={formData.jambRegNo}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>
                </div>

                {/* O'Level First Sitting */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    O'Level First Sitting *
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Exam Type
                      </label>
                      <select
                        name="oLevelFirst.examType"
                        value={formData.oLevelFirstSitting.examType}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                      >
                        <option value="">Select</option>
                        <option value="WAEC">WAEC</option>
                        <option value="NECO">NECO</option>
                        <option value="GCE">GCE</option>
                        <option value="NABTEB">NABTEB</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Exam Number
                      </label>
                      <input
                        type="text"
                        name="oLevelFirst.examNumber"
                        value={formData.oLevelFirstSitting.examNumber}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Exam Year
                      </label>
                      <input
                        type="text"
                        name="oLevelFirst.examYear"
                        value={formData.oLevelFirstSitting.examYear}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subjects & Grades *
                    </label>
                    {formData.oLevelFirstSitting.subjects.map(
                      (subject, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2"
                        >
                          <input
                            type="text"
                            placeholder="Subject"
                            value={subject.subject}
                            onChange={(e) =>
                              handleSubjectChange(
                                index,
                                "subject",
                                e.target.value,
                                "first"
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                          />
                          <select
                            value={subject.grade}
                            onChange={(e) =>
                              handleSubjectChange(
                                index,
                                "grade",
                                e.target.value,
                                "first"
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                          >
                            <option value="">Grade</option>
                            <option value="A1">A1</option>
                            <option value="B2">B2</option>
                            <option value="B3">B3</option>
                            <option value="C4">C4</option>
                            <option value="C5">C5</option>
                            <option value="C6">C6</option>
                            <option value="D7">D7</option>
                            <option value="E8">E8</option>
                            <option value="F9">F9</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeSubject(index, "first")}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => addSubject("first")}
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Add Subject
                    </button>
                  </div>
                </div>

                {/* O'Level Second Sitting */}
                <div className="border-t pt-6">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="hasSecondSitting"
                      checked={hasSecondSitting}
                      onChange={(e) => {
                        setHasSecondSitting(e.target.checked);
                        if (!e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            oLevelSecondSitting: undefined,
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            oLevelSecondSitting: {
                              examType: "",
                              examNumber: "",
                              examYear: "",
                              subjects: [],
                            },
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor="hasSecondSitting"
                      className="text-sm font-medium text-gray-700"
                    >
                      I have a second sitting
                    </label>
                  </div>

                  {hasSecondSitting && formData.oLevelSecondSitting && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        O'Level Second Sitting
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Exam Type
                          </label>
                          <select
                            name="oLevelSecond.examType"
                            value={formData.oLevelSecondSitting.examType}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                          >
                            <option value="">Select</option>
                            <option value="WAEC">WAEC</option>
                            <option value="NECO">NECO</option>
                            <option value="GCE">GCE</option>
                            <option value="NABTEB">NABTEB</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Exam Number
                          </label>
                          <input
                            type="text"
                            name="oLevelSecond.examNumber"
                            value={formData.oLevelSecondSitting.examNumber}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Exam Year
                          </label>
                          <input
                            type="text"
                            name="oLevelSecond.examYear"
                            value={formData.oLevelSecondSitting.examYear}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subjects & Grades
                        </label>
                        {formData.oLevelSecondSitting.subjects.map(
                          (subject, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2"
                            >
                              <input
                                type="text"
                                placeholder="Subject"
                                value={subject.subject}
                                onChange={(e) =>
                                  handleSubjectChange(
                                    index,
                                    "subject",
                                    e.target.value,
                                    "second"
                                  )
                                }
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                              />
                              <select
                                value={subject.grade}
                                onChange={(e) =>
                                  handleSubjectChange(
                                    index,
                                    "grade",
                                    e.target.value,
                                    "second"
                                  )
                                }
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                              >
                                <option value="">Grade</option>
                                <option value="A1">A1</option>
                                <option value="B2">B2</option>
                                <option value="B3">B3</option>
                                <option value="C4">C4</option>
                                <option value="C5">C5</option>
                                <option value="C6">C6</option>
                                <option value="D7">D7</option>
                                <option value="E8">E8</option>
                                <option value="F9">F9</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => removeSubject(index, "second")}
                                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                              >
                                Remove
                              </button>
                            </div>
                          )
                        )}
                        <button
                          type="button"
                          onClick={() => addSubject("second")}
                          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Add Subject
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(1)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection(3)}
                    className="px-6 py-2 bg-asceta-blue text-white rounded-md hover:bg-blue-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Section 3: Course Selection */}
            {currentSection === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Course Selection
                </h2>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    First Choice *
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Program
                      </label>
                      <input
                        type="text"
                        name="firstChoice.program"
                        value={formData.firstChoice.program}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., NCE"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <input
                        type="text"
                        name="firstChoice.department"
                        value={formData.firstChoice.department}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Computer Science"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="hasSecondChoice"
                      checked={hasSecondChoice}
                      onChange={(e) => {
                        setHasSecondChoice(e.target.checked);
                        if (!e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            secondChoice: undefined,
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            secondChoice: { program: "", department: "" },
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor="hasSecondChoice"
                      className="text-sm font-medium text-gray-700"
                    >
                      I have a second choice
                    </label>
                  </div>

                  {hasSecondChoice && formData.secondChoice && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Second Choice
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Program
                          </label>
                          <input
                            type="text"
                            name="secondChoice.program"
                            value={formData.secondChoice.program}
                            onChange={handleInputChange}
                            placeholder="e.g., NCE"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Department
                          </label>
                          <input
                            type="text"
                            name="secondChoice.department"
                            value={formData.secondChoice.department}
                            onChange={handleInputChange}
                            placeholder="e.g., Computer Science"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(2)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection(4)}
                    className="px-6 py-2 bg-asceta-blue text-white rounded-md hover:bg-blue-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Section 4: Next of Kin */}
            {currentSection === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Next of Kin Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="nextOfKin.name"
                      value={formData.nextOfKin.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Relationship *
                    </label>
                    <input
                      type="text"
                      name="nextOfKin.relationship"
                      value={formData.nextOfKin.relationship}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Father, Mother, Guardian"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="nextOfKin.phone"
                      value={formData.nextOfKin.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <textarea
                    name="nextOfKin.address"
                    value={formData.nextOfKin.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asceta-blue focus:border-asceta-blue"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(3)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection(5)}
                    className="px-6 py-2 bg-asceta-blue text-white rounded-md hover:bg-blue-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Section 5: Review & Submit */}
            {currentSection === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Review & Submit
                </h2>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
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
                        Please review all information carefully before
                        submitting. Once submitted, you can still make changes
                        by editing your application.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Personal Information</h3>
                    <p>
                      {formData.surname} {formData.middleName}{" "}
                      {formData.firstName}
                    </p>
                    <p>Sex: {formData.sex}</p>
                    <p>Date of Birth: {formData.dateOfBirth}</p>
                    <p>Phone: {formData.phone}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">
                      Educational Background
                    </h3>
                    {formData.jambScore && (
                      <p>JAMB Score: {formData.jambScore}</p>
                    )}
                    {formData.jambRegNo && (
                      <p>JAMB Reg No: {formData.jambRegNo}</p>
                    )}
                    <p>
                      O'Level First: {formData.oLevelFirstSitting.examType} -{" "}
                      {formData.oLevelFirstSitting.examYear}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Course Selection</h3>
                    <p>
                      First Choice: {formData.firstChoice.program} -{" "}
                      {formData.firstChoice.department}
                    </p>
                    {formData.secondChoice && (
                      <p>
                        Second Choice: {formData.secondChoice.program} -{" "}
                        {formData.secondChoice.department}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Next of Kin</h3>
                    <p>Name: {formData.nextOfKin.name}</p>
                    <p>Relationship: {formData.nextOfKin.relationship}</p>
                    <p>Phone: {formData.nextOfKin.phone}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(4)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {hasExistingApplication
                      ? "Update Application"
                      : "Submit Application"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
