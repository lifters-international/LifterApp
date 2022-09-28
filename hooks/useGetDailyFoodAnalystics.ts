import React from 'react';
import { useSelector } from "react-redux";

import { fetchGraphQl, LiftersDailyFoodAnalstics, getCurrentDate } from '../utils';

import { getLiftersDailyFoodAnalytics } from "../graphQlQuieries";

export type DailyFoodAnalsticsState = {
    loading: boolean;
    error: boolean; 
    analysis: LiftersDailyFoodAnalstics | null;
}

export const useGetDailyFoodAnalystics = ( ): DailyFoodAnalsticsState => {
    const [ state, setState ] = React.useState<DailyFoodAnalsticsState>({
        loading: true,
        error: false,
        analysis: null
    });

    const { token } = useSelector((state: any) => state.Auth);

    React.useEffect(() => {
        const getDailyFoodAnalystics = async () => {
            const res = await fetchGraphQl(getLiftersDailyFoodAnalytics, { token, date: getCurrentDate() });

            if (res.errors) {
                setState({
                    ...state,
                    loading: false,
                    error: true
                });
            } else {
                setState({
                    ...state,
                    loading: false,
                    error: false,
                    analysis: res.data.getLiftersDailyFoodAnalytics
                });
            }
        };
        getDailyFoodAnalystics();
    }, [ token ]);

    return state;
}