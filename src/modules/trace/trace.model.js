import mongoose from "mongoose";

// ─── Sub-Schemas ─────────────────────────────────────────────────

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    country: { type: String, default: null, note: "ISO 3166" },
    region: { type: String, default: null },
    city: { type: String, default: null },
    address: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    embCode: { type: String, default: null },
    gln: { type: String, default: null },
  },
  { _id: false }
);

const sensorReadingSchema = new mongoose.Schema(
  {
    timestamp: { type: Date},
    temperatureCelsius: { type: Number},
    humidity: { type: Number, default: null },
    isWithinRange: { type: Boolean},
  },
  { _id: false }
);

// ─── Quality Check Detail Schemas (polymorph) ─────────────────────

const temperatureCheckDetailSchema = new mongoose.Schema(
  {
    measuredCelsius: { type: Number},
    minAllowedCelsius: { type: Number},
    maxAllowedCelsius: { type: Number},
    isWithinRange: { type: Boolean},
    sensorId: { type: String},
    log: [sensorReadingSchema],
  },
  { _id: false }
);

const pathogenResultSchema = new mongoose.Schema(
  {
    pathogen: { type: String},
    testMethod: { type: String, default: null },
    detected: { type: Boolean, default: null },
    cfuPerGram: { type: Number, default: null },
    euLimitCfuPerGram: { type: Number, default: null },
    limitExceeded: { type: Boolean, default: null },
    analysisDurationHours: { type: Number, default: null },
    status: { type: String, default: null },
  },
  { _id: false }
);

const bacterialCountSchema = new mongoose.Schema(
  {
    count: { type: Number, default: null },
    unit: { type: String, default: null },
    status: { type: String, default: null },
  },
  { _id: false }
);

const labTestMethodSchema = new mongoose.Schema(
  {
    technique: { type: String, default: null },
    standard: { type: String, default: null },
    duration: { type: Number, default: null },
  },
  { _id: false }
);

const microbiologicalCheckDetailSchema = new mongoose.Schema(
  {
    laboratoryName: { type: String, default: null },
    iso17025Accredited: { type: Boolean, default: null },
    laboratoryType: { type: String, default: null },
    samplingMethod: { type: String, default: null },
    verdict: { type: String, default: null },
    recommendation: { type: String, default: null },
    pathogensTested: [pathogenResultSchema],
    totalBacterialCount: { type: bacterialCountSchema, default: null },
    testMethods: [labTestMethodSchema],
  },
  { _id: false }
);

const chemicalSubstanceSchema = new mongoose.Schema(
  {
    substance: { type: String},
    category: { type: String, default: null },
    measuredMgPerKg: { type: Number, default: null },
    limitMgPerKg: { type: Number, default: null },
    limitExceeded: { type: Boolean, default: null },
    status: { type: String, default: null },
  },
  { _id: false }
);

const chemicalCheckDetailSchema = new mongoose.Schema(
  {
    laboratoryName: { type: String, default: null },
    testMethod: { type: String, default: null },
    substancesTested: [chemicalSubstanceSchema],
  },
  { _id: false }
);

const measuredNutritionalSchema = new mongoose.Schema(
  {
    energyKcal100g: { type: Number, default: null },
    fat100g: { type: Number, default: null },
    saturatedFat100g: { type: Number, default: null },
    carbohydrates100g: { type: Number, default: null },
    sugars100g: { type: Number, default: null },
    proteins100g: { type: Number, default: null },
    salt100g: { type: Number, default: null },
    fiber100g: { type: Number, default: null },
  },
  { _id: false }
);

const nutritionalCheckDetailSchema = new mongoose.Schema(
  {
    laboratoryName: { type: String, default: null },
    measuredValues: { type: measuredNutritionalSchema, default: null },
  },
  { _id: false }
);

const packagingIntegrityDetailSchema = new mongoose.Schema(
  {
    integrityOk: { type: Boolean, default: null },
    sealOk: { type: Boolean, default: null },
    labelOk: { type: Boolean, default: null },
    vacuumOk: { type: Boolean, default: null },
    modifiedAtmosphereOk: { type: Boolean, default: null },
    notes: { type: String, default: null },
  },
  { _id: false }
);

const visualInspectionDetailSchema = new mongoose.Schema(
  {
    colorOk: { type: Boolean, default: null },
    textureOk: { type: Boolean, default: null },
    odorOk: { type: Boolean, default: null },
    foreignMatterFound: { type: Boolean, default: null },
    defectRate: { type: Number, default: null },
    notes: { type: String, default: null },
  },
  { _id: false }
);

const weightCheckDetailSchema = new mongoose.Schema(
  {
    measuredWeightGrams: { type: Number},
    declaredWeightGrams: { type: Number},
    tolerancePercent: { type: Number, default: null },
    withinTolerance: { type: Boolean, default: null },
  },
  { _id: false }
);

const nonConformitySchema = new mongoose.Schema(
  {
    id: { type: String},
    description: { type: String},
    severity: { type: String, default: null },
    resolvedAt: { type: Date, default: null },
  },
  { _id: false }
);

const certificationAuditDetailSchema = new mongoose.Schema(
  {
    auditType: { type: String, default: null },
    auditorName: { type: String, default: null },
    auditedStandard: { type: String, default: null },
    passed: { type: Boolean, default: null },
    validUntil: { type: Date, default: null },
    nonConformities: [nonConformitySchema],
  },
  { _id: false }
);

const genericCheckDetailSchema = new mongoose.Schema(
  {
    result: { type: String, default: null },
    notes: { type: String, default: null },
  },
  { _id: false }
);

// ─── Quality Check Schema ─────────────────────────────────────────

const qualityCheckSchema = new mongoose.Schema(
  {
    id: { type: String},
    type: { type: String},
    status: { type: String},
    performedAt: { type: Date, default: null },
    performedBy: { type: String, default: null },
    accreditationNumber: { type: String, default: null },
    reportNumber: { type: String, default: null },
    resultSummary: { type: String, default: null },
    nextCheckDue: { type: Date, default: null },
    isMandatory: { type: Boolean},
    // Polymorph detail — als Mixed gespeichert, type-Feld bestimmt Inhalt
    detail: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: false }
);

// ─── Station Detail Schemas (polymorph) ──────────────────────────

const fieldCoordinateSchema = new mongoose.Schema(
  {
    latitude: { type: Number},
    longitude: { type: Number},
    areaHectares: { type: Number, default: null },
  },
  { _id: false }
);

const transportLegSchema = new mongoose.Schema(
  {
    mode: { type: String, default: null },
    distanceKm: { type: Number, default: null },
    durationHours: { type: Number, default: null },
    co2Kg: { type: Number, default: null },
    from: { type: locationSchema, default: null },
    to: { type: locationSchema, default: null },
  },
  { _id: false }
);

// ─── Station Schema ───────────────────────────────────────────────

const stationSchema = new mongoose.Schema(
  {
    id: { type: String},
    type: { type: String},
    status: { type: String},
    title: { type: String},
    subtitle: { type: String, default: null },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    durationHours: { type: Number, default: null },
    co2KgPerKg: { type: Number, default: null },
    isVerified: { type: Boolean},
    verifiedBy: { type: String, default: null },
    notes: { type: String, default: null },
    wasRefrigerated: { type: Boolean},
    refrigerationTemperatureCelsius: { type: Number, default: null },
    certificationIds: [String],
    location: { type: locationSchema, default: null },
    qualityChecks: [qualityCheckSchema],
    environmentSummary: {
      co2KgPerKg: { type: Number, default: null },
      waterLiterPerKg: { type: Number, default: null },
      energyKwhPerKg: { type: Number, default: null },
      landUseM2PerKg: { type: Number, default: null },
    },
    // Polymorph station detail — type-Feld der Station bestimmt Inhalt
    detail: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: false }
);

// ─── Environment Summary ──────────────────────────────────────────

const co2ByPhaseSchema = new mongoose.Schema(
  {
    agriculture: { type: Number, default: null },
    processing: { type: Number, default: null },
    transportation: { type: Number, default: null },
    packaging: { type: Number, default: null },
    distribution: { type: Number, default: null },
    consumption: { type: Number, default: null },
  },
  { _id: false }
);

const environmentSummarySchema = new mongoose.Schema(
  {
    co2TotalKgPerKg: { type: Number, default: null },
    ecoscoreGrade: { type: String, default: null },
    ecoscoreScore: { type: Number, default: null },
    waterFootprintLiterPerKg: { type: Number, default: null },
    waterStressScore: { type: Number, default: null },
    forestFootprintM2PerKg: { type: Number, default: null },
    forestFootprintGrade: { type: String, default: null },
    deforestationRisk: { type: Number, default: null },
    transportEmissionsGramsCo2: { type: Number, default: null },
    totalTransportDistanceKm: { type: Number, default: null },
    transportLegCount: { type: Number, default: null },
    packagingCo2Kg: { type: Number, default: null },
    packagingScore: { type: Number, default: null },
    recyclablePackagingPercent: { type: Number, default: null },
    productionSystemBonus: { type: Number, default: null },
    originEpiScore: { type: Number, default: null },
    co2ByPhase: { type: co2ByPhaseSchema, default: null },
    threatenedSpeciesRisk: {
      ingredient: { type: String, default: null },
      ecoscorePenalty: { type: Number, default: null },
      explanation: { type: String, default: null },
    },
  },
  { _id: false }
);

// ─── Certifications ───────────────────────────────────────────────

const certificationSchema = new mongoose.Schema(
  {
    id: { type: String},
    type: { type: String},
    scope: { type: String, default: null },
    source: { type: String, default: null },
    issuedBy: { type: String, default: null },
    issuedAt: { type: Date, default: null },
    validUntil: { type: Date, default: null },
    certificateUrl: { type: String, default: null },
    verifiedByTomapo: { type: Boolean, default: false },
  },
  { _id: false }
);

// ─── Traceability Score ───────────────────────────────────────────

const traceabilityScoreSchema = new mongoose.Schema(
  {
    completeness: { type: Number, min: 0, max: 1 },
    verifiedStations: { type: Number, default: 0 },
    unknownStations: { type: Number, default: 0 },
    hasGaps: { type: Boolean, default: false },
    isThirdPartyVerified: { type: Boolean, default: false },
    blockchainHash: { type: String, default: null },
  },
  { _id: false }
);

// ─── Data Sources ─────────────────────────────────────────────────

const dataSourceSchema = new mongoose.Schema(
  {
    id: { type: String},
    type: { type: String, default: null },
    reliability: { type: String, default: null },
    name: { type: String, default: null },
    url: { type: String, default: null },
    fetchedAt: { type: Date, default: null },
  },
  { _id: false }
);

// ─── Cold Chain ───────────────────────────────────────────────────

const coldChainBreakSchema = new mongoose.Schema(
  {
    stationId: { type: String, default: null },
    startedAt: { type: Date },
    endedAt: { type: Date, default: null },
    maxTempCelsius: { type: Number, default: null },
    durationMinutes: { type: Number, default: null },
    severity: { type: String, default: null },
  },
  { _id: false }
);

const coldStorageDetailSchema = new mongoose.Schema(
  {
    stationId: { type: String, default: null },
    facilityName: { type: String, default: null },
    tempMinCelsius: { type: Number, default: null },
    tempMaxCelsius: { type: Number, default: null },
    humidityPercent: { type: Number, default: null },
    durationHours: { type: Number, default: null },
  },
  { _id: false }
);

const coldChainSummarySchema = new mongoose.Schema(
  {
    isCompliant: { type: Boolean},
    totalRefrigeratedHours: { type: Number, default: 0 },
    totalUnrefrigeratedHours: { type: Number, default: 0 },
    maxTemperatureCelsius: { type: Number, default: null },
    minTemperatureCelsius: { type: Number, default: null },
    avgTemperatureCelsius: { type: Number, default: null },
    breakCount: { type: Number, default: 0 },
    breaks: [coldChainBreakSchema],
    storageDetails: [coldStorageDetailSchema],
  },
  { _id: false }
);

// ─── Ingredients (polymorph) ──────────────────────────────────────

const subProductIngredientSchema = new mongoose.Schema(
  {
    barcode: { type: String, default: null },
    productName: { type: String},
    brand: { type: String, default: null },
    category: { type: String, default: null },
    percentMin: { type: Number, default: null },
    percentMax: { type: Number, default: null },
    percentEstimate: { type: Number, default: null },
    isTraceable: { type: Boolean, default: false },
    originCountry: { type: String, default: null },
  },
  { _id: false }
);

const chemicalIngredientSchema = new mongoose.Schema(
  {
    name: { type: String},
    eNumber: { type: String, default: null },
    casNumber: { type: String, default: null },
    category: { type: String, default: null },
    function: { type: String, default: null },
    origin: { type: String, default: null },
    euStatus: { type: String, default: null },
    healthAssessment: { type: String, default: null },
    concentrationMgPerKg: { type: Number, default: null },
    adAcceptableDailyIntake: { type: Number, default: null },
  },
  { _id: false }
);

const productIngredientSchema = new mongoose.Schema(
  {
    ingredientType: {
      type: String,
      enum: ["subProduct", "chemical"],
    },
    subProduct: { type: subProductIngredientSchema, default: null },
    chemical: { type: chemicalIngredientSchema, default: null },
  },
  { _id: false }
);

// ─── Main Trace Schema ────────────────────────────────────────────

const traceSchema = new mongoose.Schema(
  {
    barcode: { type: String, index: true },
    batchId: { type: String, default: null, index: true },
    generatedAt: { type: Date, default: Date.now },
    requiresColdChain: { type: Boolean, default: false },
    alertIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alert" }],

    stations: [stationSchema],
    environmentSummary: { type: environmentSummarySchema, default: null },
    certifications: [certificationSchema],
    traceabilityScore: { type: traceabilityScoreSchema, default: null },
    dataSources: [dataSourceSchema],
    coldChainSummary: { type: coldChainSummarySchema, default: null },
    ingredients: [productIngredientSchema],
  },
  { timestamps: true }
);

// Compound index für barcode + batchId
traceSchema.index({ barcode: 1, batchId: 1 });

const Trace = mongoose.model("Trace", traceSchema, "traces");
export default Trace;
