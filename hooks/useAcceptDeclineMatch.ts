import React, { useState } from 'react';

import { fetchGraphQl, GraphqlError } from '../utils';

import { acceptDeclineMatch } from '../graphQlQuieries';

export type AcceptDeclineMatchesState = {
    loading: boolean;
    acceptDecline: (token: string, matchId: string, accept: boolean, callback?: (result : string) => void, errorCallback?: (error: GraphqlError[]) => void) => Promise<void>;
}

export const useAcceptDeclineMatch = (): AcceptDeclineMatchesState => {
    const [loading, setLoading] = useState(false);

    const acceptDecline = async (token: string, matchId: string, accept: boolean, callback?: (result : string) => void, errorCallback?: (error: GraphqlError[]) => void) => {
        setLoading(true);
        const result = await fetchGraphQl(acceptDeclineMatch, {
            token,
            matchId,
            accept
        });

        setLoading(false);

        if (result.errors && errorCallback) errorCallback(result.errors);
        else if (callback) callback( (result.data as { acceptDeclineMatch: string }).acceptDeclineMatch );
    }

    return {
        loading,
        acceptDecline
    }
}