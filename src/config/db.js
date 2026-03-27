import mongoose from "mongoose";

export default async function connectDB() {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message || err);
    process.exit(1);
  }
}