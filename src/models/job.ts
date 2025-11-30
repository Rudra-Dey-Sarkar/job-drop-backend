import { Schema, model } from "mongoose";

export const sectorEnum =  [
    "it",
    "software",
    "engineering",
    "finance",
    "accounting",
    "marketing",
    "sales",
    "design",
    "product",
    "hr",
    "operations",
    "legal",
    "healthcare",
    "education",
    "manufacturing",
    "construction",
    "logistics",
    "hospitality",
    "retail",
    "customer-service",
    "real-estate",
    "media",
    "entertainment",
    "consulting",
    "energy",
    "telecom",
    "government",
    "non-profit",
    "research",
    "biotech",
    "security",
    "agriculture",
    "automotive",
    "food-services",
    "sports",
    "other"
  ];

const JobSchema = new Schema(
  {
    company_id: { type: Schema.Types.ObjectId, ref: "company" },
    title: String,
    description: { type: String, default: null },
    locations: {
      location: { type: [String], default: null },
      type: { type: String, enum: ['remote', 'hybrid', 'on-site'], default: "remote" }
    },
    type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], default: "full-time" },
    sector: { type: String, enum: sectorEnum, default: "other" },
    experience_level: { type: String, enum: ['intern', 'entry', 'junior' ,'mid', 'senior'], default: "entry" },
    salary_range: { 
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
      duration: { type: String, enum: ['month', 'year'], default: 'yearly' } 
     },
    status: { type: String, enum: ['published', 'draft', ], default: "draft" },
  },
  { timestamps: true }
);

export default model("job", JobSchema);
