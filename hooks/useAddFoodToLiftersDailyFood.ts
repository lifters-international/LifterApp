import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { AddFoodToLiftersDailyFood } from "../graphQlQuieries";

import { fetchGraphQl, delay } from "../utils";

export type AddFoodToLiftersDailyFoodStates = {
    addFoodToLiftersDailyFood: ( foodId : string) => void;
    statement: string;  
}

export const useAddFoodToLiftersDailyFood = (): AddFoodToLiftersDailyFoodStates => {
    const [statement, setStatement] = useState("ADD TO DAILY FOOD");
    const { token } = useSelector((state: any) => state.Auth);

    const addFoodToLiftersDailyFood = async (foodId: string) => {
        setStatement("Adding...");

        const response = await fetchGraphQl(AddFoodToLiftersDailyFood, { token, foodId });

        if (response.errors) {
            setStatement("Problem Adding Food, please try again later.");
        }else {
            setStatement("Added Food");
        }

        await delay(2000);

        setStatement("ADD TO DAILY FOOD");
    };

    return { addFoodToLiftersDailyFood, statement };
}
