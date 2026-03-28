import { AppError } from "../../utils/appError.util.js";

const INTELLIGENCE_URL = process.env.INTELLIGENCE_URL || "http://localhost:8000";

// ─── Health Check ─────────────────────────────────────────────────

export const checkHealth = async () => {
  const res = await fetch(`${INTELLIGENCE_URL}/health`);
  if (!res.ok) throw new AppError("Intelligence service unavailable", 503);
  return res.json();
};

// ─── Trace → flaches ML-Objekt ────────────────────────────────────
// Feldnamen müssen EXAKT mit dem Python Pydantic IntelligenceRequest übereinstimmen.

export const flattenTrace = (trace) => {
  const cold    = trace.coldChainSummary   ?? {};
  const score   = trace.traceabilityScore  ?? {};
  const alerts  = trace.alertIds           ?? [];

  const allStations = trace.stations ?? [];
  const allChecks   = allStations.flatMap(s => s.qualityChecks ?? []);
  const allDetails  = allChecks.map(c => c.detail ?? {});

  // ── Temperatur ───────────────────────────────────────────────────
  const tempDetail  = allDetails.find(d => d.measuredCelsius !== undefined) ?? {};

  // ── Mikrobiologie ────────────────────────────────────────────────
  const allPathogens    = allDetails.flatMap(d => d.pathogensTested      ?? []);
  const allMicroResults = allDetails.flatMap(d => d.microbiologicalResults ?? []);

  // ── Chemie ───────────────────────────────────────────────────────
  const allSubstances  = allDetails.flatMap(d => d.substancesTested ?? []);
  const allChemResults = allDetails.flatMap(d => d.chemicalResults   ?? []);

  // ── Labor ────────────────────────────────────────────────────────
  const labDetail      = allDetails.find(d => d.verdict !== undefined || d.legalLimitsExceeded !== undefined) ?? {};
  const allPhysical    = allDetails.flatMap(d => d.physicalResults    ?? []);
  const allAllergens   = allDetails.flatMap(d => d.allergenResults    ?? []);
  const allAuthenticity= allDetails.flatMap(d => d.authenticityResults ?? []);

  // ── Zertifikate ──────────────────────────────────────────────────
  const certs      = trace.certifications ?? [];
  const allNonConf = allDetails.flatMap(d => d.nonConformities ?? []);
  const auditDetail= allDetails.find(d => d.auditType !== undefined) ?? {};

  // ── Visuelle Inspektion ──────────────────────────────────────────
  const visDetail  = allDetails.find(d => d.moldDetected !== undefined || d.colorOk !== undefined) ?? {};

  // ── Packaging ────────────────────────────────────────────────────
  const packDetail = allDetails.find(d => d.isLeaking !== undefined || d.isSealed !== undefined) ?? {};

  // ── Gewicht ──────────────────────────────────────────────────────
  const weightDetail = allDetails.find(d => d.measuredWeightGrams !== undefined || d.measuredWeightG !== undefined) ?? {};

  // ── Transport & Lagerung ─────────────────────────────────────────
  const transportSta   = allStations.find(s => s.type === "transport");
  const transportDetail= transportSta?.detail ?? {};
  const storageSta     = allStations.find(s => s.type === "storage");
  const storageDetail  = storageSta?.detail ?? {};
  const distSta        = allStations.find(s => s.type === "distribution");
  const distDetail     = distSta?.detail ?? {};

  // ── Farming / Processing / Fishing ───────────────────────────────
  const farmingDetail  = allStations.find(s => s.type === "farming")?.detail   ?? {};
  const procDetail     = allStations.find(s => s.type === "processing")?.detail ?? {};
  const fishDetail     = allStations.find(s => s.type === "fishing")?.detail   ?? {};

  // ── Alert-Severity Mapping (critical=4/high=3/medium=2/low=1) ────
  const sevMap = { critical: 4, high: 3, medium: 2, low: 1 };
  const alertDocs = trace._alertDocs ?? [];
  const alertSeverityMax  = alertDocs.length > 0 ? Math.max(...alertDocs.map(a => sevMap[a.severity] ?? 0)) : 0;
  const alertsActiveCount = alertDocs.filter(a => a.status === "active").length;

  // ── Cert-Ablauf in Tagen ─────────────────────────────────────────
  const now = Date.now();
  const certDaysMin = certs.length > 0
    ? Math.min(...certs.map(c => c.validUntil ? Math.floor((new Date(c.validUntil) - now) / 86400000) : 9999))
    : 9999;

  // ── NonConformity severity mapping (critical=3/major=2/minor=1) ──
  const ncSevMap = { critical: 3, major: 2, minor: 1 };

  // ── Transport-Verspätung in Minuten ──────────────────────────────
  const scheduled = transportDetail.scheduledArrival ? new Date(transportDetail.scheduledArrival) : null;
  const actual    = transportDetail.actualArrival    ? new Date(transportDetail.actualArrival)    : null;
  const transportDelayMinutes = (scheduled && actual) ? Math.max(0, Math.round((actual - scheduled) / 60000)) : 0;

  // ── Cold Chain Storage Detail (erster Eintrag) ───────────────────
  const coldStorageFirst = cold.storageDetails?.[0] ?? {};

  return {
    batchId:   trace.batchId ?? "unknown",
    productId: trace.barcode ?? "unknown",

    // ── KÜHLKETTE — exakt Python-Feldnamen ────────────────────────
    hadColdChainBreak:                   (cold.breakCount ?? 0) > 0 || cold.hadColdChainBreak ? 1 : 0,
    isIntact:                            cold.isCompliant ? 1 : 0,
    highestTemperatureCelsius:           cold.maxTemperatureCelsius              ?? 0,
    lowestTemperatureCelsius:            cold.minTemperatureCelsius              ?? 0,
    coldChainBreakCount:                 cold.breakCount                         ?? 0,
    totalBreakDurationMinutes:           (cold.breaks ?? []).reduce((s, b) => s + (b.durationMinutes ?? 0), 0),
    totalRefrigeratedTransportHours:     cold.totalRefrigeratedHours             ?? 0,
    coldChainBroken:                     (cold.breaks?.length ?? 0) > 0 ? 1 : 0,
    coldStorage_maxActualTemperatureCelsius: coldStorageFirst.tempMaxCelsius     ?? 0,
    coldStorage_minActualTemperatureCelsius: coldStorageFirst.tempMinCelsius     ?? 0,
    coldStorage_avgActualTemperatureCelsius: cold.avgTemperatureCelsius          ?? 0,
    coldStorage_targetTemperatureCelsius:    coldStorageFirst.tempMinCelsius     ?? 0,
    coldChainBreaks_maxTemperatureReached:  (cold.breaks ?? []).reduce((m, b) => Math.max(m, b.maxTempCelsius ?? 0), 0),
    coldChainBreaks_totalDurationMinutes:   (cold.breaks ?? []).reduce((s, b) => s + (b.durationMinutes ?? 0), 0),

    // ── TEMPERATUR ────────────────────────────────────────────────
    measuredCelsius:                     tempDetail.measuredCelsius              ?? 0,
    minAllowedCelsius:                   tempDetail.minAllowedCelsius            ?? 0,
    maxAllowedCelsius:                   tempDetail.maxAllowedCelsius            ?? 0,
    tempIsWithinRange:                   tempDetail.isWithinRange                ? 1 : 0,
    refrigerationTemperatureCelsius:     allStations.find(s => s.wasRefrigerated)?.refrigerationTemperatureCelsius ?? 0,
    wasRefrigerated:                     allStations.some(s => s.wasRefrigerated) ? 1 : 0,
    harvestTemperatureCelsius:           0,
    processingTemperatureCelsius:        0,
    displayTemperatureCelsius:           allStations.find(s => s.type === "retail")?.detail?.shelfTempCelsius ?? 0,
    sampleArrivalTemperatureCelsius:     0,

    // ── MIKROBIOLOGIE ─────────────────────────────────────────────
    pathogensDetectedCount:              allPathogens.filter(p => p.detected).length,
    pathogensCfuPerGramMax:              allPathogens.reduce((m, p) => Math.max(m, p.cfuPerGram ?? 0), 0),
    pathogensLimitExceededCount:         allPathogens.filter(p => p.limitExceeded).length,
    microbiologicalDetectedCount:        allMicroResults.filter(r => r.detected).length,
    microbiologicalCfuPerGramMax:        allMicroResults.reduce((m, r) => Math.max(m, r.cfuPerGram ?? 0), 0),
    microbiologicalLimitExceededCount:   allMicroResults.filter(r => r.limitExceeded).length,

    // ── CHEMIKALIEN ───────────────────────────────────────────────
    substancesMeasuredMgPerKgMax:        allSubstances.reduce((m, s) => Math.max(m, s.measuredMgPerKg ?? 0), 0),
    substancesLimitMgPerKg:              allSubstances.reduce((m, s) => Math.max(m, s.limitMgPerKg   ?? 0), 0),
    substancesLimitExceededCount:        allSubstances.filter(s => s.limitExceeded).length,
    chemicalMeasuredValueMax:            allChemResults.reduce((m, r) => Math.max(m, r.measuredValue ?? 0), 0),
    chemicalMrlValue:                    allChemResults.reduce((m, r) => Math.max(m, r.mrlValue      ?? 0), 0),
    chemicalMrlExceededCount:            allChemResults.filter(r => r.mrlExceeded).length,
    chemicalBelowLod:                    allChemResults.some(r => r.belowLod) ? 1 : 0,

    // ── LABOR ─────────────────────────────────────────────────────
    overallVerdictFail:                  labDetail.verdict === "FAIL" ? 1 : 0,
    legalLimitsExceeded:                 labDetail.legalLimitsExceeded ? 1 : 0,
    exceedanceCount:                     labDetail.exceedanceCount     ?? 0,
    isIso17025Accredited:                labDetail.iso17025Accredited  ? 1 : 0,
    nutritionalDeviationPercent:         0,
    nutritionalIsWithinEuTolerance:      1,
    physicalOutOfSpecCount:              allPhysical.filter(p => !p.isWithinSpec).length,

    // ── ALLERGENE ─────────────────────────────────────────────────
    allergenDetectedCount:               allAllergens.filter(a => a.detected).length,
    allergenMeasuredMgPerKgMax:          allAllergens.reduce((m, a) => Math.max(m, a.ppmDetected ?? 0), 0),
    allergenLabelIncorrectCount:         allAllergens.filter(a => a.labelledCorrectly === false).length,

    // ── AUTHENTIZITÄT ─────────────────────────────────────────────
    authenticityFailCount:               allAuthenticity.filter(a => a.isAuthentic === false).length,
    authenticityConfidencePercentMin:    allAuthenticity.length > 0
      ? Math.min(...allAuthenticity.map(a => a.confidencePercent ?? 100))
      : 100,

    // ── ZERTIFIKATE ───────────────────────────────────────────────
    certificationDaysUntilExpiry:        certDaysMin === 9999 ? 9999 : certDaysMin,
    certificationAuditScore:             auditDetail.score ?? 0,
    nonConformitiesSeverityMax:          allNonConf.length > 0 ? Math.max(...allNonConf.map(n => ncSevMap[n.severity] ?? 0)) : 0,
    nonConformitiesUncorrectedCount:     allNonConf.filter(n => !n.corrected).length,
    nonConformitiesOverdueDays:          allNonConf.filter(n => n.correctionDeadline && new Date(n.correctionDeadline) < new Date() && !n.corrected).length,

    // ── VISUELLE INSPEKTION ───────────────────────────────────────
    moldDetected:                        visDetail.moldDetected        ? 1 : 0,
    foreignBodyDetected:                 visDetail.foreignBodyDetected ? 1 : 0,
    colorOk:                             visDetail.colorOk  !== false  ? 1 : 0,
    shapeOk:                             visDetail.shapeOk  !== false  ? 1 : 0,
    surfaceOk:                           visDetail.surfaceOk !== false ? 1 : 0,
    rejectionRate:                       visDetail.rejectionRate        ?? 0,
    visualDefectsFound:                  visDetail.defectsFound         ?? 0,

    // ── PACKAGING ─────────────────────────────────────────────────
    isLeaking:                           packDetail.isLeaking            ? 1 : 0,
    isSealed:                            packDetail.isSealed !== false   ? 1 : 0,
    vacuumIntact:                        packDetail.vacuumIntact !== false ? 1 : 0,
    mapGasCompositionCorrect:            packDetail.mapGasCompositionCorrect !== false ? 1 : 0,
    labelingCorrect:                     packDetail.labelingCorrect !== false ? 1 : 0,
    barcodeReadable:                     packDetail.barcodeReadable !== false ? 1 : 0,
    fillWeightCorrect:                   packDetail.fillWeightCorrect !== false ? 1 : 0,
    packagingDefectsFound:               packDetail.defectsFound ?? 0,

    // ── GEWICHT ───────────────────────────────────────────────────
    measuredWeightG:                     weightDetail.measuredWeightGrams ?? weightDetail.measuredWeightG ?? 0,
    targetWeightG:                       weightDetail.declaredWeightGrams ?? weightDetail.targetWeightG   ?? 0,
    weightTolerancePercent:              weightDetail.tolerancePercent    ?? 0,
    weightIsWithinTolerance:             weightDetail.withinTolerance !== false ? 1 : 0,
    weightSampleSize:                    weightDetail.sampleSize ?? 0,

    // ── TRANSPORT & LAGERUNG ──────────────────────────────────────
    distanceKm:                          transportDetail.distanceKm      ?? 0,
    transportIsRefrigerated:             transportDetail.tempControlled  ? 1 : 0,
    co2EmissionsKg:                      transportDetail.co2EmissionsKg  ?? 0,
    transportDelayMinutes,
    maxDurationExceeded:                 storageDetail.maxDurationExceeded ? 1 : 0,
    storageAverageTemperatureCelsius:    storageDetail.averageTemperatureCelsius ?? 0,
    humidityPercent:                     storageDetail.humidityPercent    ?? 0,
    storageDurationHours:                storageSta?.durationHours        ?? 0,
    importInspectionPassed:              distDetail.importInspectionPassed !== false ? 1 : 0,
    customsCleared:                      distDetail.customsCleared        !== false ? 1 : 0,
    handlingCount:                       distDetail.handlingCount         ?? 0,

    // ── ALERTS ────────────────────────────────────────────────────
    alertsTotalCount:                    alerts.length,
    alertsSeverityMax:                   alertSeverityMax,
    alertsActiveCount,

    // ── TRACEABILITY ──────────────────────────────────────────────
    traceabilityCompleteness:            score.completeness            ?? 0,
    traceabilityHasGaps:                 score.hasGaps                 ? 1 : 0,
    isThirdPartyVerified:                score.isThirdPartyVerified    ? 1 : 0,
    verifiedStations:                    score.verifiedStations        ?? 0,
    unknownStations:                     score.unknownStations         ?? 0,

    // ── FARMING ───────────────────────────────────────────────────
    yieldPercent:                        farmingDetail.cropYieldTonsPerHectare ?? 0,
    areaHectares:                        farmingDetail.fieldCoordinates?.[0]?.areaHectares ?? 0,
    isHaccpCertified:                    procDetail.haccp              ? 1 : 0,
    batchSizeKg:                         procDetail.batchSizeKg        ?? 0,
    isMscCertified:                      fishDetail.mscCertified       ? 1 : 0,
    isAscCertified:                      fishDetail.ascCertified       ? 1 : 0,
  };
};

// ─── POST /analyze ────────────────────────────────────────────────

export const analyzeTrace = async (trace) => {
  const body = flattenTrace(trace);

  let res;
  try {
    res = await fetch(`${INTELLIGENCE_URL}/analyze`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
  } catch {
    return null; // Graceful degradation — Service nicht erreichbar
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new AppError(
      `Intelligence service error: ${err.detail ?? res.statusText}`,
      res.status === 422 ? 422 : 502
    );
  }

  return res.json();
};

// ─── POST /chat (Streaming) ───────────────────────────────────────

export const streamChat = async ({ batchId, productId, chatHistory, batchContext, productInfo }) => {
  const res = await fetch(`${INTELLIGENCE_URL}/chat`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ batchId, productId, chatHistory, batchContext, productInfo }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new AppError(
      `Intelligence chat error: ${err.detail ?? res.statusText}`,
      res.status === 422 ? 422 : 502
    );
  }

  return res;
};