import React, { useState, useEffect } from "react";

import { TrainersDetails, fetchGraphQl } from "../utils";

import { getTrainersDetailsById } from "../graphQlQuieries";
 
export type useGetTrainerDetailsProps = {
    id: string;
}

export type useGetTrainerDetailsState = {
    loading: boolean;
    error: boolean;
    data?: TrainersDetails;
}

export const useGetTrainerDetails = ({ id }: useGetTrainerDetailsProps) => {
    const [ state, setState ] = useState<useGetTrainerDetailsState>({
        loading: true,
        error: false
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const result = await fetchGraphQl(getTrainersDetailsById, { id });

                const data = result.data.getTrainersDetailsById;

                setState({
                    loading: false,
                    error: false,
                    data
                });
            } catch (error) {
                setState({
                    loading: false,
                    error: true
                });
            }
        }
        getData();
    }

    , [ id ]);

    return state;
}
