import mongoose from "mongoose";
import { PRODUCT_BARCODES } from "./constants.seed.js";

export const ALERT_IDS = {
  blvRecallLindt:    new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9b001"),
  migrosQuality:     new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9b002"),
  infoOvomaltine:    new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9b003"),
  communityMilch:    new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9b004"),
  communityElTony:   new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9b005"),
};

export async function seedAlerts(traces, users) {
  const db = mongoose.connection.db;

  const elTonyTrace = traces.find(t => t.barcode === PRODUCT_BARCODES.elTonyMate);
  const lindtTrace  = traces.find(t => t.barcode === PRODUCT_BARCODES.lindt85);

  const alerts = [
    // ── Alert 1: BLV Rückruf Lindt ────────────────────────────────
    {
      _id:               ALERT_IDS.blvRecallLindt,
      barcode:           PRODUCT_BARCODES.lindt85,
      batchId:           "LINDT-85-2026-0201",
      source:            "official",
      category:          "recall",
      severity:          "high",
      title:             "Rückruf: Lindt Excellence 85% — erhöhter Cadmiumgehalt",
      description:       "Das Bundesamt für Lebensmittelsicherheit hat einen Rückruf für die Charge LINDT-85-2026-0201 ausgesprochen. Cadmiumgehalt 0.28mg/kg — innerhalb EU-Grenzwert, jedoch über Tomapo-Schwellenwert.",
      actionRequired:    "Produkt nicht konsumieren. Zurückgeben an Verkaufsstelle.",
      referenceId:       "BLV-2026-0215-004",
      moreInfoUrl:       "https://www.blv.admin.ch/rueckrufe/2026/lindt-cadmium",
      status:            "active",
      confirmationCount: 12,
      rejectionCount:    2,
      expiresAt:         new Date("2026-12-31T00:00:00Z"),
      createdAt:         new Date("2026-02-15T10:00:00Z"),
      updatedAt:         new Date("2026-02-15T10:00:00Z"),
    },

    // ── Alert 2: Migros Qualitätswarnung ──────────────────────────
    {
      _id:               ALERT_IDS.migrosQuality,
      barcode:           PRODUCT_BARCODES.migrosMilch,
      batchId:           null,
      source:            "retailer",
      category:          "quality",
      severity:          "medium",
      title:             "Qualitätshinweis: Migros Vollmilch — verkürzte Haltbarkeit",
      description:       "Aufgrund eines Kühlkettenproblems bei der Lieferung kann die Haltbarkeit einzelner Chargen verkürzt sein. Bitte MHD prüfen.",
      actionRequired:    "MHD überprüfen. Bei Unsicherheit Produkt nicht konsumieren.",
      referenceId:       "MGR-QA-2026-0318",
      moreInfoUrl:       null,
      status:            "active",
      confirmationCount: 5,
      rejectionCount:    1,
      expiresAt:         new Date("2026-04-01T00:00:00Z"),
      createdAt:         new Date("2026-03-18T08:00:00Z"),
      updatedAt:         new Date("2026-03-18T08:00:00Z"),
    },

    // ── Alert 3: Info Ovomaltine ───────────────────────────────────
    {
      _id:               ALERT_IDS.infoOvomaltine,
      barcode:           PRODUCT_BARCODES.ovomaltine,
      batchId:           null,
      source:            "official",
      category:          "information",
      severity:          "low",
      title:             "Information: Ovomaltine — neue Rezeptur ab Q2 2026",
      description:       "Ab April 2026 wird die Rezeptur leicht angepasst. Zuckergehalt wird um 8% reduziert. Geschmack und Nährwertprofil bleiben weitgehend gleich.",
      actionRequired:    null,
      referenceId:       "WANDER-PR-2026-001",
      moreInfoUrl:       "https://www.ovomaltine.ch/news/rezeptur-2026",
      status:            "active",
      confirmationCount: 0,
      rejectionCount:    0,
      expiresAt:         new Date("2026-06-30T00:00:00Z"),
      createdAt:         new Date("2026-03-01T09:00:00Z"),
      updatedAt:         new Date("2026-03-01T09:00:00Z"),
    },

    // ── Alert 4: Community Milch ──────────────────────────────────
    {
      _id:               ALERT_IDS.communityMilch,
      barcode:           PRODUCT_BARCODES.migrosMilch,
      batchId:           "MILCH-2026-0320",
      source:            "community",
      category:          "quality",
      severity:          "low",
      title:             "Community: Milch riecht leicht säuerlich",
      description:       "Mehrere User berichten, dass die Charge MILCH-2026-0320 bereits beim Öffnen leicht säuerlich riecht, obwohl MHD noch 5 Tage entfernt.",
      actionRequired:    "Bei auffälligem Geruch nicht konsumieren.",
      referenceId:       null,
      moreInfoUrl:       null,
      status:            "active",
      confirmationCount: 8,
      rejectionCount:    3,
      expiresAt:         new Date("2026-03-31T00:00:00Z"),
      createdAt:         new Date("2026-03-21T14:00:00Z"),
      updatedAt:         new Date("2026-03-21T14:00:00Z"),
    },

    // ── Alert 5: Community El Tony Mate ───────────────────────────
    {
      _id:               ALERT_IDS.communityElTony,
      barcode:           PRODUCT_BARCODES.elTonyMate,
      batchId:           "L250634716:41",
      source:            "community",
      category:          "quality",
      severity:          "low",
      title:             "Community: El Tony Mate — Flasche undicht",
      description:       "Einzelne User aus der Charge L250634716:41 berichten von leicht undichten Verschlüssen. Kein Gesundheitsrisiko, aber Qualitätsmangel.",
      actionRequired:    "Verschluss vor dem Kauf prüfen.",
      referenceId:       null,
      moreInfoUrl:       null,
      status:            "active",
      confirmationCount: 3,
      rejectionCount:    1,
      expiresAt:         new Date("2025-12-31T00:00:00Z"),
      createdAt:         new Date("2025-06-10T11:00:00Z"),
      updatedAt:         new Date("2025-06-10T11:00:00Z"),
    },
  ];

  await db.collection("alerts").insertMany(alerts);
  console.log(`   ✓ Alerts: ${alerts.length} inserted`);

  // alertIds in Traces zurückschreiben
  if (lindtTrace) {
    await db.collection("traces").updateOne(
      { _id: lindtTrace._id },
      { $set: { alertIds: [ALERT_IDS.blvRecallLindt] } }
    );
    console.log("   ✓ Lindt trace alertIds synced");
  }
  if (elTonyTrace) {
    await db.collection("traces").updateOne(
      { _id: elTonyTrace._id },
      { $set: { alertIds: [ALERT_IDS.communityElTony] } }
    );
    console.log("   ✓ El Tony Mate trace alertIds synced");
  }

  return alerts;
}