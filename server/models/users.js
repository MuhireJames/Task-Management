import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"], // Email validation
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true } 
);
usersSchema.virtual("isAdmin").get(function () {
  return this.role === "admin";
});

usersSchema.set("toJSON", { virtuals: true });
usersSchema.set("toObject", { virtuals: true });


export default mongoose.model("Users", usersSchema);
