import React, { useState, useEffect } from "react";

import { getAcceptedClientTrainers } from "../graphQlQuieries";

import { TrainerAcceptedClients, fetchGraphQl, GraphqlError, socket } from "../utils";

export type TrainerAcceptedClientsState = {
    loading: boolean;
    error: GraphqlError[];
    data: TrainerAcceptedClients[]
}

export const useAcceptedTrainers = (token : string) => {
    const [ state, setState ] = useState<TrainerAcceptedClientsState>({
        loading: true,
        error: [],
        data: []
    });

    const [ change, setChange ] = useState(false);

    const fetchChange = () => {
        fetchGraphQl(getAcceptedClientTrainers, { token })
        .then( res => {
            let data : { getAcceptedClientTrainers : TrainerAcceptedClients[] } = res.data;

            if ( res.errors ) {
                setState(prev => {
                    return {
                        ...prev,
                        loading: false,
                        error: res.errors
                    }
                })
            }else {
                setState(prev => {
                    return {
                       ...prev,
                        loading: false,
                        data: data.getAcceptedClientTrainers
                    }
                })
            }
        })
    }

    useEffect(() => {
        if ( token === null ) return;

        fetchChange();

        if ( socket != null ) {
            socket.onTrainerClient("ChangeClientsOrder", () => {
                setChange(true);
            });
        }
    }, [ token ]);

    useEffect(() => {
       if ( !change ) return;
       
       fetchChange();
       setChange(false);
    }, [ change ])

    return state;
}

