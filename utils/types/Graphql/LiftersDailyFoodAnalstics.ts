import { Food } from "./Food";

export type LiftersDailyFoodAnalstics = {
    Calories: number;

    Fat: number;

    Carbs: number;

    Protein: number;

    CalorieGoal: number;

    FatsGoal: number;

    CarbsGoal: number;

    ProteinGoal: number;

    Foods: Food[]
}
