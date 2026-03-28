import mongoose from "mongoose";
import { PRODUCT_BARCODES } from "./constants.seed.js";

export const MESSAGE_IDS = {
  maxMsgLindt: new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9c001"),
  laraMsgMilch: new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9c002"),
  timoMsgElTony: new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9c003"),
};

export async function seedUserMessages(users) {
  const db = mongoose.connection.db;

  const maxUser = users.find((u) => u.email === "max.mueller@example.ch");
  const laraUser = users.find((u) => u.email === "lara.schmid@example.ch");
  const timoUser = users.find((u) => u.email === "timo.keller@example.ch");

  const messages = [
    // ── Meldung 1: Max — Lindt Fremdkörper ───────────────────────
    {
      _id: MESSAGE_IDS.maxMsgLindt,
      authorId: maxUser._id,
      authorNickname: "maxmueller",
      category: "safety",
      title: "Fremdkörper in Lindt Excellence 85%",
      body: "Beim Öffnen der Tafel habe ich ein kleines Plastikstück (ca. 3mm) gefunden. Charge LINDT-85-2026-0201, Kaufdatum 20.02.2026, Migros Zürich HB.",
      severity: "high",
      submissionStatus: "submitted",
      linkedAlertId: null,
      productSnapshot: {
        barcode: PRODUCT_BARCODES.lindt85,
        batchId: "LINDT-85-2026-0201",
        productName: "Lindt Excellence 85% Cacao",
        brand: "Lindt",
        quantity: "100g",
        imageUrl:
          "https://images.openfoodfacts.org/images/products/304/692/002/8836/front.jpg",
        nutriscoreGrade: "d",
        ecoscoreGrade: "c",
        categoriesTags: ["chocolates", "dark-chocolates"],
        scannedAt: new Date("2026-02-20T14:30:00Z"),
        scannedAtStoreName: "Migros Zürich HB",
      },
      createdAt: new Date("2026-02-20T15:00:00Z"),
      updatedAt: new Date("2026-02-20T15:00:00Z"),
    },

    // ── Meldung 2: Lara — Milch säuerlich ────────────────────────
    {
      _id: MESSAGE_IDS.laraMsgMilch,
      authorId: laraUser._id,
      authorNickname: "laras",
      category: "quality",
      title: "Migros Vollmilch riecht säuerlich vor MHD",
      body: "Die Milch aus Charge MILCH-2026-0320 riecht bereits beim Öffnen leicht säuerlich. MHD ist noch 4 Tage entfernt. Konsistenz wirkt normal, aber Geruch definitiv nicht frisch.",
      severity: "medium",
      submissionStatus: "pending",
      linkedAlertId: null,
      productSnapshot: {
        barcode: PRODUCT_BARCODES.migrosMilch,
        batchId: "MILCH-2026-0320",
        productName: "Migros Vollmilch 1L",
        brand: "Migros",
        quantity: "1L",
        imageUrl: null,
        nutriscoreGrade: "b",
        ecoscoreGrade: "c",
        categoriesTags: ["milks", "whole-milks"],
        scannedAt: new Date("2026-03-22T09:00:00Z"),
        scannedAtStoreName: "Migros Oerlikon",
      },
      createdAt: new Date("2026-03-22T09:30:00Z"),
      updatedAt: new Date("2026-03-22T09:30:00Z"),
    },

    // ── Meldung 3: Timo — El Tony undicht ────────────────────────
    {
      _id: MESSAGE_IDS.timoMsgElTony,
      authorId: timoUser._id,
      authorNickname: "timok",
      category: "quality",
      title: "El Tony Mate Flasche undicht",
      body: "Habe heute eine Flasche El Tony Mate (Charge L250634716:41) gekauft und der Verschluss war nicht richtig zu. Ein paar ml Flüssigkeit haben sich bereits verloren. Kein Geruch, aber trotzdem blöd.",
      severity: "low",
      submissionStatus: "pending",
      linkedAlertId: null,
      productSnapshot: {
        barcode: PRODUCT_BARCODES.elTonyMate,
        batchId: "L250634716:41",
        productName: "El Tony Mate 330ml",
        brand: "El Tony",
        quantity: "330ml",
        imageUrl:
          "https://images.openfoodfacts.org/images/products/764/015/049/1001/front.jpg",
        nutriscoreGrade: "b",
        ecoscoreGrade: "b",
        categoriesTags: ["beverages", "sodas", "mate"],
        scannedAt: new Date("2025-06-12T16:00:00Z"),
        scannedAtStoreName: "Coop City Zürich Bellevue",
      },
      createdAt: new Date("2025-06-12T16:30:00Z"),
      updatedAt: new Date("2025-06-12T16:30:00Z"),
    },
  ];

  await db.collection("user_messages").insertMany(messages);
  console.log(`   ✓ UserMessages: ${messages.length} inserted`);

  // Denormalisierung in users.messages[]
  if (maxUser) {
    await db
      .collection("users")
      .updateOne(
        { _id: maxUser._id },
        {
          $push: {
            messages: {
              _id: MESSAGE_IDS.maxMsgLindt,
              title: messages[0].title,
              category: messages[0].category,
              severity: messages[0].severity,
              submissionStatus: messages[0].submissionStatus,
              createdAt: messages[0].createdAt,
            },
          },
        }
      );
  }
  if (laraUser) {
    await db
      .collection("users")
      .updateOne(
        { _id: laraUser._id },
        {
          $push: {
            messages: {
              _id: MESSAGE_IDS.laraMsgMilch,
              title: messages[1].title,
              category: messages[1].category,
              severity: messages[1].severity,
              submissionStatus: messages[1].submissionStatus,
              createdAt: messages[1].createdAt,
            },
          },
        }
      );
  }
  if (timoUser) {
    await db
      .collection("users")
      .updateOne(
        { _id: timoUser._id },
        {
          $push: {
            messages: {
              _id: MESSAGE_IDS.timoMsgElTony,
              title: messages[2].title,
              category: messages[2].category,
              severity: messages[2].severity,
              submissionStatus: messages[2].submissionStatus,
              createdAt: messages[2].createdAt,
            },
          },
        }
      );
  }
  console.log("   ✓ UserMessages denormalized into users.messages[]");

  return messages;
}
