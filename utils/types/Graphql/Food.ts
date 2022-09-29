export enum NutritionUnits {
    mL = "mL",
    mcg = "mcg",
    L = "L",
    dL = "dL",
    t = "t",
    tsp = "tsp",
    tbsp = "tbsp",
    gill = "gill",
    cup = "cup",
    pt = "pt",
    qt = "qt",
    gal = "gal",
    mg = "mg",
    g = "g",
    kg = "kg",
    lb = "lb",
    oz = "oz",
    can = "can",
    percent = "%"
}

export type NutritionFactsJson = {
    measurment: number;
    unit: NutritionUnits;
}

export type NutritionFacts = {
    totalFat: NutritionFactsJson;

    saturatedFat: NutritionFactsJson;

    transFat: NutritionFactsJson;

    cholesterol: NutritionFactsJson;

    sodium: NutritionFactsJson;

    totalCarbohydrate: NutritionFactsJson;

    dietaryFiber: NutritionFactsJson;

    totalSugars: NutritionFactsJson;

    addedSugars: NutritionFactsJson;

    protein: NutritionFactsJson;

    vitaminD: NutritionFactsJson;

    calcium: NutritionFactsJson;

    iron: NutritionFactsJson;

    potassium: NutritionFactsJson;
}

export type NutritionFactsInput = {
    totalFat?: NutritionFactsJson;

    saturatedFat?: NutritionFactsJson;

    transFat?: NutritionFactsJson;

    cholesterol?: NutritionFactsJson;

    sodium?: NutritionFactsJson;

    totalCarbohydrate?: NutritionFactsJson;

    dietaryFiber?: NutritionFactsJson;

    totalSugars?: NutritionFactsJson;

    addedSugars?: NutritionFactsJson;

    protein?: NutritionFactsJson;

    vitaminD?: NutritionFactsJson;

    calcium?: NutritionFactsJson;

    iron?: NutritionFactsJson;

    potassium?: NutritionFactsJson;
}

export type Food = {
    id: string;

    name: string;

    calories: number;

    servingSize: NutritionFactsJson;

    nutritionFacts: NutritionFacts;
}
