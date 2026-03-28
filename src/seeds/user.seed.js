import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const hash = (pw) => bcrypt.hashSync(pw, 12);

export const USER_IDS = {
  maxMueller: new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9d001"),
  laraSchmid: new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9d002"),
  timoKeller: new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9d003"),
  sofiaRossi: new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9d004"),
};

const users = [
  {
    _id: USER_IDS.maxMueller,
    fullName: "Max Müller",
    email: "max.mueller@example.ch",
    nickname: "maxmueller",
    password: hash("Test1234!"),
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=maxmueller",
    isSyncedWithBackend: true,
    messages: [],
    createdAt: new Date("2025-11-01T08:00:00Z"),
    updatedAt: new Date("2026-03-15T10:30:00Z"),
  },
  {
    _id: USER_IDS.laraSchmid,
    fullName: "Lara Schmid",
    email: "lara.schmid@example.ch",
    nickname: "laras",
    password: hash("Test1234!"),
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=laras",
    isSyncedWithBackend: true,
    messages: [],
    createdAt: new Date("2025-12-15T09:00:00Z"),
    updatedAt: new Date("2026-02-20T14:00:00Z"),
  },
  {
    _id: USER_IDS.timoKeller,
    fullName: "Timo Keller",
    email: "timo.keller@example.ch",
    nickname: "timok",
    password: hash("Test1234!"),
    avatarUrl: null,
    isSyncedWithBackend: true,
    messages: [],
    createdAt: new Date("2026-01-10T11:00:00Z"),
    updatedAt: new Date("2026-01-10T11:00:00Z"),
  },
  {
    _id: USER_IDS.sofiaRossi,
    fullName: "Sofia Rossi",
    email: "sofia.rossi@example.ch",
    nickname: "sofiar",
    password: hash("Test1234!"),
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofiar",
    isSyncedWithBackend: false,
    messages: [],
    createdAt: new Date("2026-02-05T16:00:00Z"),
    updatedAt: new Date("2026-02-05T16:00:00Z"),
  },
];

export async function seedUsers() {
  const db = mongoose.connection.db;
  await db.collection("users").insertMany(users);
  console.log(`   ✓ Users: ${users.length} inserted`);
  return users;
}
