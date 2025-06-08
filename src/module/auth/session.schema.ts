// models/session.schema.ts
import mongoose, { ObjectId, Schema } from "mongoose";

// Define session document interface
export interface SessionDocument extends mongoose.Document<ObjectId> {
  userId: ObjectId;
  loginTime: Date;
  logoutTime?: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    loginTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    logoutTime: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const SessionModel = mongoose.model<SessionDocument>("Session", SessionSchema);

export default SessionModel;
