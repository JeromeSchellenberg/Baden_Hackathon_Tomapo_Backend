import mongoose from "mongoose";
import { USER_IDS } from "./user.seed.js";
import { ALERT_IDS } from "./alerts.seed.js";
import { PRODUCT_BARCODES } from "./constants.seed.js";

export const MESSAGE_IDS = {
  maxLindt:    new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9c001"),
  laraOvo:     new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9c002"),
  timoCola:    new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9c003"),
};

export async function seedUserMessages(users, products) {
  const db = mongoose.connection.db;

  const messages = [
    // Max meldet Lindt-Problem (linked zum offiziellen Recall)
    {
      _id:             MESSAGE_IDS.maxLindt,
      authorId:        USER_IDS.maxMueller,
      authorNickname:  "maxmueller",
      category:        "recall",
      title:           "Metallsplitter in Lindt Schokolade gefunden",
      body:            "Ich habe heute beim Essen meiner Lindt Excellence 85% einen harten metallischen Gegenstand im Mund gespürt. Glücklicherweise habe ich nicht darauf gebissen. Kaufdatum war gestern im Migros ZH HB, Charge LINDT-85-2026-0201.",
      severity:        "high",
      submissionStatus:"accepted",
      linkedAlertId:   ALERT_IDS.lindtRecall,
      productSnapshot: {
        barcode:          PRODUCT_BARCODES.lindt85,
        batchId:          "LINDT-85-2026-0201",
        productName:      "Lindt Excellence 85% Cacao",
        brand:            "Lindt",
        quantity:         "100 g",
        imageUrl:         "https://images.openfoodfacts.org/images/products/304/692/002/8836/front_de.12.400.jpg",
        nutriscoreGrade:  "d",
        ecoscoreGrade:    "c",
        categoriesTags:   ["chocolates", "dark-chocolates"],
        scannedAt:        new Date("2026-03-12T20:00:00Z"),
        scannedAtStoreName: "Migros Zürich HB",
      },
      createdAt: new Date("2026-03-12T21:15:00Z"),
      updatedAt: new Date("2026-03-13T09:00:00Z"),
    },

    // Lara meldet Ovomaltine-Klumpen (verknüpft mit Community-Alert)
    {
      _id:             MESSAGE_IDS.laraOvo,
      authorId:        USER_IDS.laraSchmid,
      authorNickname:  "laras",
      category:        "quality",
      title:           "Ovomaltine Pulver verklumpt",
      body:            "Neue Dose gekauft, Pulver enthält grosse Klumpen die sich nicht auflösen. Dose war originalverschlossen, kein Feuchtigkeitsschaden sichtbar. Charge OVO-2026-0301.",
      severity:        "low",
      submissionStatus:"submitted",
      linkedAlertId:   ALERT_IDS.ovoCommunity,
      productSnapshot: {
        barcode:          PRODUCT_BARCODES.ovomaltine,
        batchId:          "OVO-2026-0301",
        productName:      "Ovomaltine Pulver",
        brand:            "Wander",
        quantity:         "500 g",
        imageUrl:         "https://images.openfoodfacts.org/images/products/761/030/500/1002/front_de.10.400.jpg",
        nutriscoreGrade:  "c",
        ecoscoreGrade:    "b",
        categoriesTags:   ["chocolate-powders"],
        scannedAt:        new Date("2026-03-20T19:00:00Z"),
        scannedAtStoreName: "Coop Bern Zentrum",
      },
      createdAt: new Date("2026-03-20T19:20:00Z"),
      updatedAt: new Date("2026-03-20T19:20:00Z"),
    },

    // Timo meldet abweichenden Geschmack bei Coca-Cola
    {
      _id:             MESSAGE_IDS.timoCola,
      authorId:        USER_IDS.timoKeller,
      authorNickname:  "timok",
      category:        "quality",
      title:           "Coca-Cola schmeckt komisch",
      body:            "Die heutige Coca-Cola aus dem Migros hatte einen leicht chemischen, säuerlichen Nachgeschmack. Nicht wie gewohnt. Flasche war in Ordnung, nicht abgelaufen.",
      severity:        "medium",
      submissionStatus:"pending",
      linkedAlertId:   null,
      productSnapshot: {
        barcode:          PRODUCT_BARCODES.cocaCola,
        batchId:          null,
        productName:      "Coca-Cola Original Taste",
        brand:            "Coca-Cola",
        quantity:         "500 ml",
        imageUrl:         "https://images.openfoodfacts.org/images/products/544/900/000/0996/front_de.8.400.jpg",
        nutriscoreGrade:  "e",
        ecoscoreGrade:    "c",
        categoriesTags:   ["sodas", "colas"],
        scannedAt:        new Date("2026-03-16T12:30:00Z"),
        scannedAtStoreName: "Migros Winterthur",
      },
      createdAt: new Date("2026-03-16T13:00:00Z"),
      updatedAt: new Date("2026-03-16T13:00:00Z"),
    },
  ];

  await db.collection("user_messages").insertMany(messages);

  // Denormalisierte Summaries in users.messages[] eintragen
  await db.collection("users").updateOne(
    { _id: USER_IDS.maxMueller },
    { $push: { messages: {
      id:               MESSAGE_IDS.maxLindt.toString(),
      barcode:          PRODUCT_BARCODES.lindt85,
      batchId:          "LINDT-85-2026-0201",
      productName:      "Lindt Excellence 85% Cacao",
      productBrand:     "Lindt",
      productCategoryTag:"chocolates",
      messageTitle:     "Metallsplitter in Lindt Schokolade gefunden",
      messageCategory:  "recall",
      messageSeverity:  "high",
      submissionStatus: "accepted",
      createdAt:        new Date("2026-03-12T21:15:00Z"),
      updatedAt:        new Date("2026-03-13T09:00:00Z"),
    }}}
  );

  await db.collection("users").updateOne(
    { _id: USER_IDS.laraSchmid },
    { $push: { messages: {
      id:               MESSAGE_IDS.laraOvo.toString(),
      barcode:          PRODUCT_BARCODES.ovomaltine,
      batchId:          "OVO-2026-0301",
      productName:      "Ovomaltine Pulver",
      productBrand:     "Wander",
      productCategoryTag:"chocolate-powders",
      messageTitle:     "Ovomaltine Pulver verklumpt",
      messageCategory:  "quality",
      messageSeverity:  "low",
      submissionStatus: "submitted",
      createdAt:        new Date("2026-03-20T19:20:00Z"),
      updatedAt:        new Date("2026-03-20T19:20:00Z"),
    }}}
  );

  await db.collection("users").updateOne(
    { _id: USER_IDS.timoKeller },
    { $push: { messages: {
      id:               MESSAGE_IDS.timoCola.toString(),
      barcode:          PRODUCT_BARCODES.cocaCola,
      batchId:          null,
      productName:      "Coca-Cola Original Taste",
      productBrand:     "Coca-Cola",
      productCategoryTag:"sodas",
      messageTitle:     "Coca-Cola schmeckt komisch",
      messageCategory:  "quality",
      messageSeverity:  "medium",
      submissionStatus: "pending",
      createdAt:        new Date("2026-03-16T13:00:00Z"),
      updatedAt:        new Date("2026-03-16T13:00:00Z"),
    }}}
  );

  console.log(`   ✓ UserMessages: ${messages.length} inserted + summaries synced`);
  return messages;
}