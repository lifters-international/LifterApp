import React, { useState } from 'react';

import { getUserAcceptedMatches } from "../graphQlQuieries";

import { AcceptedUserMatches, fetchGraphQl, socket } from "../utils";

export type UserAcceptedMatchesSubscription = {
    loading: boolean;
    error: any;
    data: AcceptedUserMatches[];
}

export const useUserAcceptedMatchesSubscription = ( token : string, reload: boolean): UserAcceptedMatchesSubscription => {
    const [ state, setState ] = useState<UserAcceptedMatchesSubscription>({ 
        loading: false,
        error: [],
        data: []
    });

    const [ change, setChange ] = useState(false);

    const fetchChange = () => {
        fetchGraphQl(getUserAcceptedMatches, { token }).then( result => {
            let data: { getUserAcceptedMatches: AcceptedUserMatches[] } = result.data;

            if ( result.errors ) {
                setState(prevState => ({
                    ...prevState,
                    loading: false,
                    error: result.errors,
                    data: []
                }));
            }else {
                setState(prevState => ({
                    ...prevState,
                    loading: false,
                    data: data.getUserAcceptedMatches
                }));
            }
        })
    }

    React.useEffect(() => {
        if ( token == null ) return;

        setState(prevState => ({
            ...prevState,
            loading: true
        }));

        fetchChange();

        if ( socket != null ) {
            socket.on("ChangeMatchesOrder", () => {
                setChange(true);
            });
        }
    }, [token]);

    React.useEffect(() => {
        if ( change || reload) {
            fetchChange();
            setChange(false);
        }
    }, [change, reload]);

    return state;
}