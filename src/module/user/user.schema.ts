import mongoose, { ObjectId } from "mongoose";
import bcrypt from "bcrypt";

// Define user document interface
export interface UserDocument extends mongoose.Document<ObjectId> {
  fullname: string;
  email: string;
  password: string;
  googleId?: string;
  isEmailVerified?: boolean;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the user schema
const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
    },
    appleId: {
      type: String,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// pre save hook to hash the password using bcrypt
UserSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});


// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the user model
const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
