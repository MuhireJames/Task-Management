import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
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
