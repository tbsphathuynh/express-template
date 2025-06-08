import mongoose, { ObjectId } from "mongoose";

export interface MediaDocument extends mongoose.Document<ObjectId> {
  path: string;
  type: "image" | "video";
  size: number;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const MediaModel = mongoose.model<MediaDocument>("Media", MediaSchema);
export default MediaModel;
