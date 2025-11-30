import { Schema, model } from "mongoose";

const PageSchema = new Schema(
  {
    company_id: { type: Schema.Types.ObjectId, ref: "company" },
    status: { type: String, enum: ['published', 'draft',], default: "draft" },
    brand: {
      primary_color: { type: String, default: null },
      secondary_color: { type: String, default: null },
      logo_url: { type: String, default: null },
      banner_url: { type: String, default: null },
      culture_video_url: { type: String, default: null },
    },

    sections: [
      {
        id: String,
        title: { type: String, default: null },
        content: { type: String, default: null },
        images: { type: [String], default: [] }
      }
    ]
  },
  { timestamps: true }
);

export default model("page", PageSchema);
