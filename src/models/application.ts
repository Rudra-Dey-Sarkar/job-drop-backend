import { Schema, model } from "mongoose";

const ApplicationSchema = new Schema(
  {
    company_id: { type: Schema.Types.ObjectId, ref: "company" },
    job_id: { type: Schema.Types.ObjectId, ref: "job" },
    first_name: String,
    last_name: String,
    location: String,
    experience_level: {
      years: { type: Number, default: 0 },
      months: { type: Number, default: 0 }
    },
    gender: { type: String, enum: ['male', 'female'] },
    email: String,
    phone: String,
    resume_url: String,
    cover_letter: { type: String, default: null },
    status: { type: String, enum: ['applied', 'reviewed', 'interviewed', 'offered', 'rejected'], default: "applied" },
  },
  { timestamps: true }
);

export default model("application", ApplicationSchema);
