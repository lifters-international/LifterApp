import React, { useState, useEffect } from 'react';

import { searchFood } from '../graphQlQuieries';

import { fetchGraphQl, Food } from '../utils';

export type SearchFoodState = {
    foods: Food[];
    loading: boolean;
    error: boolean;
}

export const useSearchFood = ( search: string, token: string ): SearchFoodState => {
    const [ state, setState ] = useState<SearchFoodState>({
        foods: [],
        loading: true,
        error: false
    });

    useEffect(() => {
        if ( token == null || search == null ) return;

        const searchFoodQuery = async () => {
            const result = await fetchGraphQl( searchFood, { search, token });

            if ( result.errors ) {
                setState(prevState => {
                    return {
                        ...prevState,
                        error: true,
                        loading: false,
                    };
                });
            }else {
                setState(prevState => {
                    return {
                        ...prevState,
                        foods: result.data.userSearchFoods,
                        loading: false,
                    };
                });
            }
        }

        searchFoodQuery();

    }, [token, search]);

    return state;
}