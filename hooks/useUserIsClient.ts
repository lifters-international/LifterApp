import React, { useState, useEffect } from "react";
import { GraphqlError, fetchGraphQl } from "../utils";
import { userIsClient } from "../graphQlQuieries";

export type UserIsClientState = {
    loading: boolean;
    errors: GraphqlError[];
    data?: {
        clientExist: boolean;
        price: number;
        name: string;
        profilePicture: string;
        email: string;
        banner: string;
        cancelCost: number;
        hasDefaultPaymentMethod: boolean;
        clientStatement: string;
        clientId?: string;
    }
}

export const useUserIsClient = ( trainerId: string, token: string ) => {
    const [ state, setState ] = useState<UserIsClientState>({
        loading: true,
        errors: []
    });

    useEffect( () => {
        if ( trainerId === null || token === null ) return;

        fetchGraphQl(userIsClient, { trainerId, token })
        .then( res => {
            if ( res.errors ) {
                setState({
                    ...state,
                    loading: false,
                    errors: res.errors
                })
            }else {
                setState({
                    ...state,
                    loading: false,
                    data: res.data.userIsClient
                })
            }
        })
    }, [ token, trainerId ]);

    return state;
}
