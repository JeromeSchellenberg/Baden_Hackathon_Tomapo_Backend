import mongoose from "mongoose";
import { PRODUCT_BARCODES } from "./constants.seed.js";

export async function seedScanHistory(users, traces) {
  const db = mongoose.connection.db;

  const max = users.find((u) => u.email === "max.mueller@example.ch");
  const lara = users.find((u) => u.email === "lara.schmid@example.ch");
  const timo = users.find((u) => u.email === "timo.keller@example.ch");
  const sofia = users.find((u) => u.email === "sofia.rossi@example.ch");

  const elTonyTrace = traces.find(
    (t) => t.barcode === PRODUCT_BARCODES.elTonyMate
  );
  const lindtTrace = traces.find((t) => t.barcode === PRODUCT_BARCODES.lindt85);
  const milchTrace = traces.find(
    (t) => t.barcode === PRODUCT_BARCODES.migrosMilch
  );
  const cocaColaTrace = traces.find(
    (t) => t.barcode === PRODUCT_BARCODES.cocaCola
  );
  const ovoTrace = traces.find(
    (t) => t.barcode === PRODUCT_BARCODES.ovomaltine
  );

  const entries = [
    // ── Max Müller ────────────────────────────────────────────────
    {
      _id: new mongoose.Types.ObjectId(),
      userId: max._id,
      barcode: PRODUCT_BARCODES.cocaCola,
      barcodeType: "EAN-13",
      batchId: cocaColaTrace?.batchId ?? null,
      productName: "Coca-Cola Original 500ml",
      brand: "Coca-Cola",
      imageUrl:
        "https://images.openfoodfacts.org/images/products/544/900/000/0996/front.jpg",
      nutriscoreGrade: "e",
      ecoscoreGrade: "c",
      co2KgPerKg: 0.24,
      productStatus: "ok",
      bestBeforeDate: null,
      scannedAt: new Date("2026-03-25T12:30:00Z"),
      createdAt: new Date("2026-03-25T12:30:00Z"),
      updatedAt: new Date("2026-03-25T12:30:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: max._id,
      barcode: PRODUCT_BARCODES.lindt85,
      barcodeType: "EAN-13",
      batchId: lindtTrace?.batchId ?? null,
      productName: "Lindt Excellence 85% Cacao",
      brand: "Lindt",
      imageUrl:
        "https://images.openfoodfacts.org/images/products/304/692/002/8836/front.jpg",
      nutriscoreGrade: "d",
      ecoscoreGrade: "c",
      co2KgPerKg: 2.75,
      productStatus: "recallActive",
      bestBeforeDate: new Date("2026-08-01T00:00:00Z"),
      scannedAt: new Date("2026-02-20T14:30:00Z"),
      createdAt: new Date("2026-02-20T14:30:00Z"),
      updatedAt: new Date("2026-02-20T14:30:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: max._id,
      barcode: PRODUCT_BARCODES.elTonyMate,
      barcodeType: "EAN-13",
      batchId: elTonyTrace?.batchId ?? null,
      productName: "El Tony Mate 330ml",
      brand: "El Tony",
      imageUrl:
        "https://images.openfoodfacts.org/images/products/764/015/049/1001/front.jpg",
      nutriscoreGrade: "b",
      ecoscoreGrade: "b",
      co2KgPerKg: 1.49,
      productStatus: "ok",
      bestBeforeDate: null,
      scannedAt: new Date("2025-06-15T10:00:00Z"),
      createdAt: new Date("2025-06-15T10:00:00Z"),
      updatedAt: new Date("2025-06-15T10:00:00Z"),
    },

    // ── Lara Schmid ───────────────────────────────────────────────
    {
      _id: new mongoose.Types.ObjectId(),
      userId: lara._id,
      barcode: PRODUCT_BARCODES.migrosMilch,
      barcodeType: "EAN-13",
      batchId: milchTrace?.batchId ?? null,
      productName: "Migros Vollmilch 1L",
      brand: "Migros",
      imageUrl: null,
      nutriscoreGrade: "b",
      ecoscoreGrade: "c",
      co2KgPerKg: 2.0,
      productStatus: "ok",
      bestBeforeDate: new Date("2026-03-27T00:00:00Z"),
      scannedAt: new Date("2026-03-22T09:00:00Z"),
      createdAt: new Date("2026-03-22T09:00:00Z"),
      updatedAt: new Date("2026-03-22T09:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: lara._id,
      barcode: PRODUCT_BARCODES.ovomaltine,
      barcodeType: "EAN-13",
      batchId: ovoTrace?.batchId ?? null,
      productName: "Ovomaltine Pulver 500g",
      brand: "Ovomaltine",
      imageUrl:
        "https://images.openfoodfacts.org/images/products/761/030/500/1002/front.jpg",
      nutriscoreGrade: "c",
      ecoscoreGrade: "b",
      co2KgPerKg: 2.12,
      productStatus: "ok",
      bestBeforeDate: new Date("2027-01-01T00:00:00Z"),
      scannedAt: new Date("2026-03-10T18:00:00Z"),
      createdAt: new Date("2026-03-10T18:00:00Z"),
      updatedAt: new Date("2026-03-10T18:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: lara._id,
      barcode: PRODUCT_BARCODES.elTonyMate,
      barcodeType: "EAN-13",
      batchId: elTonyTrace?.batchId ?? null,
      productName: "El Tony Mate 330ml",
      brand: "El Tony",
      imageUrl:
        "https://images.openfoodfacts.org/images/products/764/015/049/1001/front.jpg",
      nutriscoreGrade: "b",
      ecoscoreGrade: "b",
      co2KgPerKg: 1.49,
      productStatus: "ok",
      bestBeforeDate: null,
      scannedAt: new Date("2025-07-02T15:30:00Z"),
      createdAt: new Date("2025-07-02T15:30:00Z"),
      updatedAt: new Date("2025-07-02T15:30:00Z"),
    },

    // ── Timo Keller ───────────────────────────────────────────────
    {
      _id: new mongoose.Types.ObjectId(),
      userId: timo._id,
      barcode: PRODUCT_BARCODES.elTonyMate,
      barcodeType: "EAN-13",
      batchId: elTonyTrace?.batchId ?? null,
      productName: "El Tony Mate 330ml",
      brand: "El Tony",
      imageUrl:
        "https://images.openfoodfacts.org/images/products/764/015/049/1001/front.jpg",
      nutriscoreGrade: "b",
      ecoscoreGrade: "b",
      co2KgPerKg: 1.49,
      productStatus: "ok",
      bestBeforeDate: null,
      scannedAt: new Date("2025-06-12T16:00:00Z"),
      createdAt: new Date("2025-06-12T16:00:00Z"),
      updatedAt: new Date("2025-06-12T16:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: timo._id,
      barcode: PRODUCT_BARCODES.cocaCola,
      barcodeType: "EAN-13",
      batchId: cocaColaTrace?.batchId ?? null,
      productName: "Coca-Cola Original 500ml",
      brand: "Coca-Cola",
      imageUrl:
        "https://images.openfoodfacts.org/images/products/544/900/000/0996/front.jpg",
      nutriscoreGrade: "e",
      ecoscoreGrade: "c",
      co2KgPerKg: 0.24,
      productStatus: "ok",
      bestBeforeDate: null,
      scannedAt: new Date("2026-01-15T13:00:00Z"),
      createdAt: new Date("2026-01-15T13:00:00Z"),
      updatedAt: new Date("2026-01-15T13:00:00Z"),
    },

    // ── Sofia Rossi ───────────────────────────────────────────────
    {
      _id: new mongoose.Types.ObjectId(),
      userId: sofia._id,
      barcode: PRODUCT_BARCODES.elTonyMate,
      barcodeType: "EAN-13",
      batchId: elTonyTrace?.batchId ?? null,
      productName: "El Tony Mate 330ml",
      brand: "El Tony",
      imageUrl:
        "https://images.openfoodfacts.org/images/products/764/015/049/1001/front.jpg",
      nutriscoreGrade: "b",
      ecoscoreGrade: "b",
      co2KgPerKg: 1.49,
      productStatus: "ok",
      bestBeforeDate: null,
      scannedAt: new Date("2025-08-05T11:00:00Z"),
      createdAt: new Date("2025-08-05T11:00:00Z"),
      updatedAt: new Date("2025-08-05T11:00:00Z"),
    },
  ];

  await db.collection("scan_history").insertMany(entries);
  console.log(`   ✓ ScanHistory: ${entries.length} inserted`);
  return entries;
}
