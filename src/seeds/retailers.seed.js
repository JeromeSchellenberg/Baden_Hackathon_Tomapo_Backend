import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const hash = (pw) => bcrypt.hashSync(pw, 12);

export const RETAILER_IDS = {
  migros: new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9e001"),
  coop:   new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9e002"),
  denner: new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9e003"),
};

const retailers = [
  {
    _id:         RETAILER_IDS.migros,
    companyName: "Migros Genossenschafts-Bund",
    email:       "info@migros.ch",
    password:    hash("Retailer1234!"),
    logoUrl:     "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Migros_Logo.svg/200px-Migros_Logo.svg.png",
    createdAt:   new Date("2025-10-01T08:00:00Z"),
    updatedAt:   new Date("2026-01-15T10:00:00Z"),
  },
  {
    _id:         RETAILER_IDS.coop,
    companyName: "Coop Genossenschaft",
    email:       "info@coop.ch",
    password:    hash("Retailer1234!"),
    logoUrl:     "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Coop_Logo.svg/200px-Coop_Logo.svg.png",
    createdAt:   new Date("2025-10-15T08:00:00Z"),
    updatedAt:   new Date("2026-02-01T09:00:00Z"),
  },
  {
    _id:         RETAILER_IDS.denner,
    companyName: "Denner AG",
    email:       "info@denner.ch",
    password:    hash("Retailer1234!"),
    logoUrl:     "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Denner_logo.svg/200px-Denner_logo.svg.png",
    createdAt:   new Date("2025-11-01T08:00:00Z"),
    updatedAt:   new Date("2025-11-01T08:00:00Z"),
  },
];

export async function seedRetailers() {
  const db = mongoose.connection.db;
  await db.collection("retailers").insertMany(retailers);
  console.log(`   ✓ Retailers: ${retailers.length} inserted`);
  return retailers;
}