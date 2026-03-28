import mongoose from "mongoose";
import { USER_IDS } from "./user.seed.js";
import { RETAILER_IDS } from "./retailers.seed.js";
import { TRACE_IDS } from "./trace.seed.js";
import { PRODUCT_BARCODES } from "./constants.seed.js";

export const ALERT_IDS = {
  lindtRecall:     new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9b001"),
  cocaColaQuality: new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9b002"),
  milchRetailer:   new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9b003"),
  ovoCommunity:    new mongoose.Types.ObjectId("64a1b2c3d4e5f6a7b8c9b004"),
};

export async function seedAlerts(traces, users) {
  const db = mongoose.connection.db;

  const alerts = [
    // ── 1. Offizieller Rückruf Lindt ─────────────────────────────
    {
      _id:              ALERT_IDS.lindtRecall,
      barcode:          PRODUCT_BARCODES.lindt85,
      batchId:          "LINDT-85-2026-0201",
      source:           "official",
      category:         "recall",
      severity:         "high",
      title:            "Rückruf: Lindt Excellence 85% — mögliche Fremdkörper",
      description:      "Das Bundesamt für Lebensmittelsicherheit (BLV) hat Lindt & Sprüngli aufgefordert, die Charge LINDT-85-2026-0201 zurückzurufen. Bei Stichprobenkontrollen wurden in vereinzelten Tafeln Metallsplitter nachgewiesen, die beim Reinigungsprozess des Conchierers abgelöst wurden. Betroffen ist ausschliesslich die Charge 2026-0201 mit Mindesthaltbarkeitsdatum 01.2028.",
      actionRequired:   "Produkt nicht konsumieren. Rückgabe in jeder Lindt-Verkaufsstelle oder via Post an Lindt & Sprüngli AG, Seestrasse 204, 8802 Kilchberg. Vollständige Erstattung wird gewährt.",
      referenceId:      "BLV-2026-0312-RC001",
      moreInfoUrl:      "https://www.blv.admin.ch/rueckrufe/2026/lindt-excellence-85",
      authorId:         null,
      authorNickname:   null,
      authorAvatarUrl:  null,
      authorLogoUrl:    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Lindt_chocolate_logo.svg/200px-Lindt_chocolate_logo.svg.png",
      retailerId:       null,
      status:           "active",
      confirmationCount:12,
      rejectionCount:   1,
      createdAt:        new Date("2026-03-12T10:00:00Z"),
      updatedAt:        new Date("2026-03-14T08:00:00Z"),
      expiresAt:        null,
    },

    // ── 2. Qualitätswarnung Coca-Cola vom Retailer (Migros) ───────
    {
      _id:             ALERT_IDS.cocaColaQuality,
      barcode:         PRODUCT_BARCODES.cocaCola,
      batchId:         "CC-CH-2026-0312",
      source:          "retailer",
      category:        "quality",
      severity:        "medium",
      title:           "Qualitätshinweis: Coca-Cola 500ml — abweichender Geschmack",
      description:     "Unsere Qualitätskontrolle hat bei vereinzelten Flaschen der Charge CC-CH-2026-0312 einen leicht abweichenden Geschmack festgestellt. Es besteht kein Gesundheitsrisiko. Die Produkte werden vorsorglich aus dem Regal genommen und zurückgesandt.",
      actionRequired:  "Produkt kann zurückgegeben werden. Bon oder Kassenzettel nicht erforderlich.",
      referenceId:     "MIGROS-QC-2026-0315",
      moreInfoUrl:     null,
      authorId:        null,
      authorNickname:  null,
      authorAvatarUrl: null,
      authorLogoUrl:   "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Migros_Logo.svg/200px-Migros_Logo.svg.png",
      retailerId:      RETAILER_IDS.migros,
      status:          "active",
      confirmationCount: 4,
      rejectionCount:    2,
      createdAt:       new Date("2026-03-15T14:00:00Z"),
      updatedAt:       new Date("2026-03-16T09:00:00Z"),
      expiresAt:       new Date("2026-04-15T00:00:00Z"),
    },

    // ── 3. Retailer-Alert Migros Milch ─────────────────────────
    {
      _id:             ALERT_IDS.milchRetailer,
      barcode:         PRODUCT_BARCODES.migrosMilch,
      batchId:         null,
      source:          "retailer",
      category:        "information",
      severity:        "low",
      title:           "Info: M-Classic Vollmilch — neue Verpackung ab April 2026",
      description:     "Ab April 2026 erscheint die M-Classic Vollmilch in einer neuen Tetra Pak Verpackung aus 80% recyceltem Karton. Der Inhalt und das Produkt bleiben unverändert. Die neue Verpackung trägt das FSC-Zertifizierungssiegel.",
      actionRequired:  null,
      referenceId:     "MIGROS-INFO-2026-003",
      moreInfoUrl:     "https://www.migros.ch/nachhaltigkeit/verpackung",
      authorId:        null,
      authorNickname:  null,
      authorAvatarUrl: null,
      authorLogoUrl:   "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Migros_Logo.svg/200px-Migros_Logo.svg.png",
      retailerId:      RETAILER_IDS.migros,
      status:          "active",
      confirmationCount: 0,
      rejectionCount:    0,
      createdAt:       new Date("2026-03-18T11:00:00Z"),
      updatedAt:       new Date("2026-03-18T11:00:00Z"),
      expiresAt:       new Date("2026-05-01T00:00:00Z"),
    },

    // ── 4. Community-Alert von User zu Ovomaltine ─────────────────
    {
      _id:             ALERT_IDS.ovoCommunity,
      barcode:         PRODUCT_BARCODES.ovomaltine,
      batchId:         "OVO-2026-0301",
      source:          "community",
      category:        "quality",
      severity:        "low",
      title:           "Community: Ovomaltine — Klumpen im Pulver",
      description:     "Habe heute eine frische Dose Ovomaltine geöffnet (Charge OVO-2026-0301, MHD 08/2027). Das Pulver enthält grössere Klumpen, die sich auch beim Rühren nicht auflösen. Könnte auf ein Feuchtigkeitsproblem beim Abfüllen oder Transport hinweisen.",
      actionRequired:  null,
      referenceId:     null,
      moreInfoUrl:     null,
      authorId:        USER_IDS.laraSchmid,
      authorNickname:  "laras",
      authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=laras",
      authorLogoUrl:   null,
      retailerId:      null,
      status:          "active",
      confirmationCount: 3,
      rejectionCount:    1,
      createdAt:       new Date("2026-03-20T19:30:00Z"),
      updatedAt:       new Date("2026-03-21T10:00:00Z"),
      expiresAt:       new Date("2026-06-20T00:00:00Z"),
    },
  ];

  await db.collection("alerts").insertMany(alerts);

  // AlertId in Lindt-Trace eintragen
  await db.collection("traces").updateOne(
    { _id: TRACE_IDS.lindt },
    { $push: { alertIds: ALERT_IDS.lindtRecall } }
  );

  console.log(`   ✓ Alerts: ${alerts.length} inserted`);
  return alerts;
}