import { Schema, model } from "mongoose";

const PageSchema = new Schema(
  {
    company_id: { type: Schema.Types.ObjectId, ref: "company" },
    status: { type: String, enum: ['published', 'draft',], default: "draft" },
    brand: {
      primary_color: {
        published: { type: String, default: null },
        draft: { type: String, default: null },
      },
      secondary_color: {
        published: { type: String, default: null },
        draft: { type: String, default: null },
      },
      logo_url: {
        published: { type: String, default: null },
        draft: { type: String, default: null },
      },
      banner_url: {
        published: { type: String, default: null },
        draft: { type: String, default: null },
      },
      culture_video_url: {
        published: { type: String, default: null },
        draft: { type: String, default: null },
      },
    },

    sections: {
      published: [
        {
          id: String,
          title: { type: String, default: null },
          content: { type: String, default: null }
        }
      ],
      draft: [
        {
          id: String,
          title: { type: String, default: null },
          content: { type: String, default: null }
        }
      ],
    }
  },
  { timestamps: true }
);

export default model("page", PageSchema);
