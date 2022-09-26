import React, { useState, useEffect } from 'react';

import { GetFood } from '../graphQlQuieries';

import { fetchGraphQl, Food } from '../utils';

export type GetFoodState = {
    loading: boolean;
    error: boolean;
    foods: Food[];
}

export const useGetFood = () : GetFoodState => {
    const [ state, setState ] = useState<GetFoodState>({ loading: true, error: false, foods: [] });

    useEffect(() => {
        const getFood = async () => {
            const resp = await fetchGraphQl(GetFood, {});

            if (resp.data) {
                setState({ loading: false, error: false, foods: resp.data.GetFoods });
            } else {
                setState({ loading: false, error: true, foods: [] });
            }
        }
        getFood();
    }, []);
    return state;
}