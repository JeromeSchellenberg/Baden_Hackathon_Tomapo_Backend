import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

async function startServer() {
  await connectDB();

  app.listen(PORT, HOST, () => {
    console.log(`Server running on ${HOST}:${PORT} [${process.env.NODE_ENV || "development"}]`);
  });
}

// Unhandled promise rejections (z.B. DB-Fehler nach dem Start)
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err.message);
  process.exit(1);
});

// Uncaught synchrone Exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});

startServer();