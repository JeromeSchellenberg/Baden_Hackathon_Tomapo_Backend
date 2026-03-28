import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";

import { seedUsers } from "./User.seed.js";
import { seedRetailers } from "./retailers.seed.js";
import { seedTraces } from "./trace.seed.js";
import { seedAlerts } from "./alerts.seed.js";
import { seedUserMessages } from "./userMessages.seed.js";
import { seedScanHistory } from "./scanHistory.seed.js";

async function runSeed() {
  try {
    await connectDB();
    console.log("MongoDB connected for seeding");

    const args = process.argv.slice(2);
    const wipe = args.includes("--wipe");

    if (wipe) {
      console.log("Wiping existing data...");
      const collections = Object.keys(mongoose.connection.collections);
      for (const name of collections) {
        await mongoose.connection.collections[name].deleteMany({});
        console.log(`   Cleared: ${name}`);
      }
    }

    console.log("\nSeeding...");

    const users     = await seedUsers();
    const retailers = await seedRetailers();
    const traces    = await seedTraces();
    await seedAlerts(traces, users);
    await seedUserMessages(users);
    await seedScanHistory(users, traces);

    console.log("\nSeeding finished successfully!");
    console.log("\nTest credentials:");
    console.log("   User:     max.mueller@example.ch / Test1234!");
    console.log("   Retailer: info@migros.ch / Retailer1234!");

  } catch (error) {
    console.error("Seeding failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }

  await mongoose.disconnect();
  process.exit(0);
}

runSeed();