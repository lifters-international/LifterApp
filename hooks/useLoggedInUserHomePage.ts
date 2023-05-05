import React, { useState, useEffect } from "react";

import { fetchGraphQl, GetLoggedInUserHomePageDetails, GraphqlError } from "../utils";

import { getLoggedInUserHomePageDetails } from "../graphQlQuieries";

export type LoggedInUserHomePageDetailsState = {
    loading: boolean;
    errors: GraphqlError[];
    data?: GetLoggedInUserHomePageDetails;
}

export const useLoggedInUserHomePage = ( token: string, refreshing: boolean ) => {
    const [ state, setState ] = useState<LoggedInUserHomePageDetailsState>({
        loading: true,
        errors: []
    });

    useEffect(() => {
        if ( token == null || !refreshing ) return;

        fetchGraphQl(getLoggedInUserHomePageDetails, { token })
        .then( res => {
            if ( res.errors ) {
                setState( prev => ({
                    ...prev,
                    loading: false,
                    errors: res.errors
                }))
            }else {
                setState( prev => ({
                    ...prev,
                    loading: false,
                    data: res.data.getLoggedInUserHomePageDetails
                }))
            }
        })
    }, [ token, refreshing ]);

    return state;
}
