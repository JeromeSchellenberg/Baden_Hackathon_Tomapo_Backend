import ProductCache from "../product/product.model.js";
import { AppError } from "../../utils/appError.util.js";

const OFF_BASE_URL = "https://world.openfoodfacts.net/api/v2/product";

// ─── OFF Response → unser Schema mappen ─────────────────────────

function mapOFFProduct(p, barcode) {
  return {
    barcode,
    productName: p.product_name ?? null,
    genericName: p.generic_name ?? null,
    brands: p.brands ?? null,
    quantity: p.quantity ?? null,
    productQuantity: p.product_quantity ?? null,
    productQuantityUnit: p.product_quantity_unit ?? null,
    servingSize: p.serving_size ?? null,
    servingQuantity: p.serving_quantity ?? null,
    storesTags: p.stores_tags ?? [],

    imageUrl: p.image_url ?? null,
    imageFrontUrl: p.image_front_url ?? null,
    imageIngredientsUrl: p.image_ingredients_url ?? null,
    imageNutritionUrl: p.image_nutrition_url ?? null,
    imagePackagingUrl: p.image_packaging_url ?? null,

    categoriesTags: p.categories_tags ?? [],
    foodGroupsTags: p.food_groups_tags ?? [],
    foodGroups: p.food_groups ?? null,
    pnnsGroups1: p.pnns_groups_1 ?? null,
    pnnsGroups2: p.pnns_groups_2 ?? null,

    nutriscoreGrade: p.nutriscore_grade ?? null,
    nutriscoreScore: p.nutriscore_score ?? null,
    ecoscoreGrade: p.ecoscore_grade ?? null,
    ecoscoreScore: p.ecoscore_score ?? null,
    novaGroup: p.nova_group ?? null,
    novaGroupError: p.nova_group_error ?? null,

    nutriments: p.nutriments ? mapNutriments(p.nutriments) : null,
    nutrientLevels: p.nutrient_levels
      ? mapNutrientLevels(p.nutrient_levels)
      : null,

    ingredientsText: p.ingredients_text ?? null,
    ingredients: (p.ingredients ?? []).map(mapIngredient),
    ingredientsN: p.ingredients_n ?? null,
    additivesN: p.additives_n ?? null,
    additivesTags: p.additives_tags ?? [],

    allergensTags: p.allergens_tags ?? [],
    tracesTags: p.traces_tags ?? [],
    ingredientsAnalysisTags: p.ingredients_analysis_tags ?? [],

    labelsTags: p.labels_tags ?? [],
    countriesTags: p.countries_tags ?? [],
    originsTags: p.origins_tags ?? [],
    manufacturingPlaces: p.manufacturing_places ?? null,
    manufacturingPlacesTags: p.manufacturing_places_tags ?? [],

    packagingTags: p.packaging_tags ?? [],
    packagings: (p.packagings ?? []).map(mapPackaging),
    packagingText: p.packaging_text ?? null,
    conservationConditions: p.conservation_conditions ?? null,

    dataQualityErrorsTags: p.data_quality_errors_tags ?? [],
    dataQualityWarningsTags: p.data_quality_warnings_tags ?? [],
    completeness: p.completeness ?? null,
    offCreatedT: p.created_t ?? null,
    offLastModifiedT: p.last_modified_t ?? null,
    offLastEditor: p.last_editor ?? null,

    cachedAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

function mapNutriments(n) {
  return {
    energyKj100g: n["energy-kj_100g"] ?? null,
    energyKcal100g: n["energy-kcal_100g"] ?? null,
    fat100g: n["fat_100g"] ?? null,
    saturatedFat100g: n["saturated-fat_100g"] ?? null,
    carbohydrates100g: n["carbohydrates_100g"] ?? null,
    sugars100g: n["sugars_100g"] ?? null,
    fiber100g: n["fiber_100g"] ?? null,
    proteins100g: n["proteins_100g"] ?? null,
    salt100g: n["salt_100g"] ?? null,
    sodium100g: n["sodium_100g"] ?? null,
    energyKcalServing: n["energy-kcal_serving"] ?? null,
    fatServing: n["fat_serving"] ?? null,
    carbohydratesServing: n["carbohydrates_serving"] ?? null,
    proteinsServing: n["proteins_serving"] ?? null,
    saltServing: n["salt_serving"] ?? null,
  };
}

function mapNutrientLevels(nl) {
  return {
    fat: nl.fat ?? null,
    saturatedFat: nl["saturated-fat"] ?? null,
    sugars: nl.sugars ?? null,
    salt: nl.salt ?? null,
  };
}

function mapIngredient(i) {
  return {
    id: i.id ?? null,
    text: i.text ?? null,
    percentMin: i.percent_min ?? null,
    percentMax: i.percent_max ?? null,
    percentEstimate: i.percent_estimate ?? null,
    vegan: i.vegan ?? null,
    vegetarian: i.vegetarian ?? null,
    fromPalmOil: i.from_palm_oil ?? null,
    ingredients: (i.ingredients ?? []).map(mapIngredient),
  };
}

function mapPackaging(pk) {
  return {
    material: pk.material ?? null,
    shape: pk.shape ?? null,
    recycling: pk.recycling ?? null,
    weightMeasured: pk.weight_measured ?? null,
    numberOfUnits: pk.number_of_units ?? null,
    quantityPerUnit: pk.quantity_per_unit ?? null,
    foodContact: pk.food_contact ?? null,
    nonRecyclableAndNonBiodegradable:
      pk.non_recyclable_and_non_biodegradable ?? null,
    environmentalScoreMaterialScore:
      pk.environmental_score_material_score ?? null,
  };
}

// ─── Service Funktionen ───────────────────────────────────────────

export const getProductByBarcode = async (barcode) => {
  // 1. Cache prüfen
  const cached = await ProductCache.findOne({ barcode });
  if (cached) {
    return { source: "cache", product: cached };
  }

  // 2. OFF API anfragen
  const response = await fetch(`${OFF_BASE_URL}/${barcode}.json`, {
    headers: { "User-Agent": "Tomapo/1.0 (contact@tomapo.app)" },
  });

  if (!response.ok) {
    throw new AppError(`OpenFoodFacts API error: ${response.status}`, 502);
  }

  const data = await response.json();

  // 3. Produkt nicht gefunden
  if (data.status === 0 || !data.product) {
    throw new AppError(`Product with barcode "${barcode}" not found`, 404);
  }

  // 4. Mappen & cachen
  const mapped = mapOFFProduct(data.product, barcode);
  const product = await ProductCache.findOneAndUpdate({ barcode }, mapped, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });

  return { source: "off", product };
};
