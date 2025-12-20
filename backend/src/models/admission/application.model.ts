import { Schema, model, Document } from "mongoose";

export interface IAdmissionApplication extends Document {
  supabaseUserId: string;
  email: string;
  // Personal Information
  surname: string;
  middleName?: string;
  firstName: string;
  sex: "Male" | "Female" | "Other";
  dateOfBirth: Date;
  phone: string;
  stateOfOrigin: string;
  localGovernmentArea: string;
  permanentHomeAddress: string;
  // Educational Background
  jambScore?: number;
  jambRegNo?: string;
  oLevelFirstSitting: {
    examType: string; // WAEC, NECO, etc.
    examNumber: string;
    examYear: string;
    subjects: Array<{
      subject: string;
      grade: string;
    }>;
  };
  oLevelSecondSitting?: {
    examType: string;
    examNumber: string;
    examYear: string;
    subjects: Array<{
      subject: string;
      grade: string;
    }>;
  };
  // Course Selection
  firstChoice: {
    program: string;
    department: string;
  };
  secondChoice?: {
    program: string;
    department: string;
  };
  // Guardian/Next of Kin
  nextOfKin: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  };
  // Documents
  passportPhoto: {
    url: string;
    public_id: string;
  };
  // Status
  status: "pending" | "submitted" | "under_review" | "admitted" | "rejected";
  assignedCourse?: {
    program: string;
    department: string;
  };
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionApplicationSchema = new Schema<IAdmissionApplication>(
  {
    supabaseUserId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Personal Information
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      required: false,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    sex: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    stateOfOrigin: {
      type: String,
      required: true,
      trim: true,
    },
    localGovernmentArea: {
      type: String,
      required: true,
      trim: true,
    },
    permanentHomeAddress: {
      type: String,
      required: true,
      trim: true,
    },
    // Educational Background
    jambScore: {
      type: Number,
      required: false,
    },
    jambRegNo: {
      type: String,
      required: false,
      trim: true,
    },
    oLevelFirstSitting: {
      examType: {
        type: String,
        required: true,
        trim: true,
      },
      examNumber: {
        type: String,
        required: true,
        trim: true,
      },
      examYear: {
        type: String,
        required: true,
        trim: true,
      },
      subjects: [
        {
          subject: {
            type: String,
            required: true,
            trim: true,
          },
          grade: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
    },
    oLevelSecondSitting: {
      examType: {
        type: String,
        required: false,
        trim: true,
      },
      examNumber: {
        type: String,
        required: false,
        trim: true,
      },
      examYear: {
        type: String,
        required: false,
        trim: true,
      },
      subjects: [
        {
          subject: {
            type: String,
            required: true,
            trim: true,
          },
          grade: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
    },
    // Course Selection
    firstChoice: {
      program: {
        type: String,
        required: true,
        trim: true,
      },
      department: {
        type: String,
        required: true,
        trim: true,
      },
    },
    secondChoice: {
      program: {
        type: String,
        required: false,
        trim: true,
      },
      department: {
        type: String,
        required: false,
        trim: true,
      },
    },
    // Next of Kin
    nextOfKin: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      relationship: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
    // Documents
    passportPhoto: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    // Status
    status: {
      type: String,
      enum: ["pending", "submitted", "under_review", "admitted", "rejected"],
      default: "pending",
      index: true,
    },
    assignedCourse: {
      program: {
        type: String,
        required: false,
        trim: true,
      },
      department: {
        type: String,
        required: false,
        trim: true,
      },
    },
    submittedAt: {
      type: Date,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: String,
      required: false,
      trim: true,
    },
    reviewNotes: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to ensure one application per user
AdmissionApplicationSchema.index(
  { supabaseUserId: 1, email: 1 },
  { unique: true }
);

export const AdmissionApplication = model<IAdmissionApplication>(
  "AdmissionApplication",
  AdmissionApplicationSchema,
  "admission-applications"
);
