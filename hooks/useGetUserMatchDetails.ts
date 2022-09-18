import React from "react";
import { fetchGraphQl, GraphqlError, UserData } from "../utils";
import { getUserMatchDetails } from "../graphQlQuieries";

export type GetUserMatchDetailsState = {
    loading: boolean;
    error: GraphqlError[];
    user?: UserData;
}

export const useGetUserMatchDetails = (token: string, matchId: string): GetUserMatchDetailsState => {
    const [ state, setState ] = React.useState<GetUserMatchDetailsState>({
        loading: true,
        error: []
    });

    React.useEffect(() => {
        if ( token == null || matchId == null ) return;
        
        setState(prevState => {
            return {
                ...prevState,
                loading: true
            }
        });

        fetchGraphQl(getUserMatchDetails, { token: token, matchId: matchId }).then(result => {
            let data: { getUserMatchDetails: UserData } = result.data;

            if ( result.errors ) {
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        error: result.errors
                    }
                });
            } else {
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        user: data.getUserMatchDetails
                    }
                });
            }
        });
    }, [token, matchId]);

    return state;
}