import React, { useState, useEffect } from "react";

import { getPendingClientTrainers } from "../graphQlQuieries";

import { fetchGraphQl, GraphqlError, TrainerPendingClients, socket } from "../utils";

export type PendingClientsState = {
    loading: boolean;
    error: GraphqlError[];
    data: TrainerPendingClients[];
}

export const usePendingTrainers = ( token : string ) => {
    const [ state, setState ] = useState<PendingClientsState>({
        loading: true,
        error: [],
        data: []
    });

    useEffect(() => {
        if ( token === null ) return;

        fetchGraphQl(getPendingClientTrainers, { token }).then(result => {
            let data: { getPendingClientTrainers: TrainerPendingClients[] } = result.data;
            
            
            if ( result.errors ) {
                setState(prevState => {
                    return {
                      ...prevState,
                        loading: false,
                        error: result.errors
                    }
                })
            }else {
                setState(prevState => {
                    return {
                     ...prevState,
                        loading: false,
                        data: data.getPendingClientTrainers
                    }
                })
            }
        })
    }, [ token ]);

    return state;
}
