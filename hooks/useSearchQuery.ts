import React from "react";

import { searchUserAndTrainers } from "../graphQlQuieries";

import { SearchLiftersAndTrainers, fetchGraphQl, SearchLiftersAndTrainersResults } from "../utils";

export type SearchQueryState = {
    result?: SearchLiftersAndTrainersResults[] | null;
    loading: boolean;
    error: any;
}

export const useSearchQuery = ( search: string, token: string ): SearchQueryState => {
    const [ state, setState ] = React.useState<SearchQueryState>({
        loading: false,
        error: []
    });

    React.useEffect(() => {
        if ( token == null || search == null ) return;

        setState(prevState => {
            return {
                ...prevState,
                loading: true,
            };
        });

        fetchGraphQl( searchUserAndTrainers, { search, token }).then( result => {
            let data: SearchLiftersAndTrainers = result.data;
            
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
                        result: data.searchUserAndTrainers.results,
                        loading: false
                    };
                });
            }
        });
    }, [token, search])

    return state;
}
