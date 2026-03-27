import mongoose from "mongoose";

// ─── Sub-Schemas ─────────────────────────────────────────────────

const nutrimentsSchema = new mongoose.Schema({
  energyKj100g:        { type: Number, default: null },
  energyKcal100g:      { type: Number, default: null },
  fat100g:             { type: Number, default: null },
  saturatedFat100g:    { type: Number, default: null },
  carbohydrates100g:   { type: Number, default: null },
  sugars100g:          { type: Number, default: null },
  fiber100g:           { type: Number, default: null },
  proteins100g:        { type: Number, default: null },
  salt100g:            { type: Number, default: null },
  sodium100g:          { type: Number, default: null },
  energyKcalServing:   { type: Number, default: null },
  fatServing:          { type: Number, default: null },
  carbohydratesServing:{ type: Number, default: null },
  proteinsServing:     { type: Number, default: null },
  saltServing:         { type: Number, default: null },
}, { _id: false });

const nutrientLevelsSchema = new mongoose.Schema({
  fat:         { type: String, default: null },
  saturatedFat:{ type: String, default: null },
  sugars:      { type: String, default: null },
  salt:        { type: String, default: null },
}, { _id: false });

const ingredientSchema = new mongoose.Schema({
  id:              { type: String, default: null },
  text:            { type: String, default: null },
  percentMin:      { type: Number, default: null },
  percentMax:      { type: Number, default: null },
  percentEstimate: { type: Number, default: null },
  vegan:           { type: String, default: null },
  vegetarian:      { type: String, default: null },
  fromPalmOil:     { type: String, default: null },
  // rekursiv — flach gespeichert, max 1 Ebene tief für Cache
  ingredients:     [{ type: mongoose.Schema.Types.Mixed }],
}, { _id: false });

const packagingSchema = new mongoose.Schema({
  material:                           { type: String, default: null },
  shape:                              { type: String, default: null },
  recycling:                          { type: String, default: null },
  weightMeasured:                     { type: Number, default: null },
  numberOfUnits:                      { type: Number, default: null },
  quantityPerUnit:                    { type: String, default: null },
  foodContact:                        { type: Number, default: null },
  nonRecyclableAndNonBiodegradable:   { type: String, default: null },
  environmentalScoreMaterialScore:    { type: Number, default: null },
}, { _id: false });

// ─── Main Schema (product_cache) ─────────────────────────────────

const productCacheSchema = new mongoose.Schema(
  {
    barcode: { type: String, required: true, unique: true, index: true },

    // Basis
    productName:          { type: String, default: null },
    genericName:          { type: String, default: null },
    brands:               { type: String, default: null },
    quantity:             { type: String, default: null },
    productQuantity:      { type: Number, default: null },
    productQuantityUnit:  { type: String, default: null },
    servingSize:          { type: String, default: null },
    servingQuantity:      { type: Number, default: null },
    storesTags:           [String],

    // Bilder
    imageUrl:             { type: String, default: null },
    imageFrontUrl:        { type: String, default: null },
    imageIngredientsUrl:  { type: String, default: null },
    imageNutritionUrl:    { type: String, default: null },
    imagePackagingUrl:    { type: String, default: null },

    // Kategorien
    categoriesTags:  [String],
    foodGroupsTags:  [String],
    foodGroups:      { type: String, default: null },
    pnnsGroups1:     { type: String, default: null },
    pnnsGroups2:     { type: String, default: null },

    // Scores
    nutriscoreGrade: { type: String, default: null },
    nutriscoreScore: { type: Number, default: null },
    ecoscoreGrade:   { type: String, default: null },
    ecoscoreScore:   { type: Number, default: null },
    novaGroup:       { type: Number, default: null },
    novaGroupError:  { type: String, default: null },

    // Nährwerte & Inhaltsstoffe
    nutriments:      { type: nutrimentsSchema,    default: null },
    nutrientLevels:  { type: nutrientLevelsSchema, default: null },
    ingredientsText: { type: String, default: null },
    ingredients:     [ingredientSchema],
    ingredientsN:    { type: Number, default: null },
    additivesN:      { type: Number, default: null },
    additivesTags:   [String],

    // Allergene
    allergensTags:             [String],
    tracesTags:                [String],
    ingredientsAnalysisTags:   [String],

    // Herkunft & Labels
    labelsTags:             [String],
    countriesTags:          [String],
    originsTags:            [String],
    manufacturingPlaces:    { type: String, default: null },
    manufacturingPlacesTags:[String],

    // Verpackung
    packagingTags:  [String],
    packagings:     [packagingSchema],
    packagingText:  { type: String, default: null },
    conservationConditions: { type: String, default: null },

    // Qualität & Meta
    dataQualityErrorsTags:   [String],
    dataQualityWarningsTags: [String],
    completeness:            { type: Number, default: null },
    offCreatedT:             { type: Number, default: null },
    offLastModifiedT:        { type: Number, default: null },
    offLastEditor:           { type: String, default: null },

    // Cache-Kontrolle
    cachedAt: { type: Date, default: Date.now },
    // TTL Index: Dokument wird nach 24h automatisch gelöscht → wird neu gefetcht
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
  },
  { timestamps: true }
);

// TTL Index — MongoDB löscht abgelaufene Cache-Einträge automatisch
productCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ProductCache = mongoose.model("ProductCache", productCacheSchema, "product_cache");
export default ProductCache;