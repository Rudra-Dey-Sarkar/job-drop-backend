import { Schema, model } from "mongoose";

const CompanySchema = new Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    description: String,
    email: String,
    password: String,
  },
  { timestamps: true }
);

export default model("company", CompanySchema);
