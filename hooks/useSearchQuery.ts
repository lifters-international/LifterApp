import React, { useState, useEffect } from "react";

import { searchQuery } from "../graphQlQuieries";

import { SearchQueryResult, fetchGraphQl, UserData } from "../utils";

export type SearchQueryState = {
    result?: UserData[] | null;
    loading: boolean;
    error: any;
}

export const useSearchQuery = ( search: string, token: string ): SearchQueryState => {
    const [ state, setState ] = useState<SearchQueryState>({
        loading: false,
        error: []
    });

    useEffect(() => {
        if ( token == null || search == null ) return;

        setState(prevState => {
            return {
                ...prevState,
                loading: true,
            };
        });

        fetchGraphQl( searchQuery, { search, token }).then( result => {
            let data: SearchQueryResult = result.data;
            
            if ( result.errors ) {
                setState(prevState => {
                    return {
                        ...prevState,
                        error: result.errors,
                        loading: false,
                    };
                });
            }else {
                setState(prevState => {
                    return {
                        ...prevState,
                        result: data.searchUsers.results,
                        loading: false,
                        userSubscription: data.searchUsers.userSubscription,
                    };
                });
            }
        });
    }, [token, search])

    return state;
}