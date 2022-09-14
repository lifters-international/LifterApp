import React, { useState, useEffect } from "react";

import { fetchGraphQl, GraphqlError, UserData } from "../utils";

import { getSignedInUserQuery } from "../graphQlQuieries";

export type SignedInUserState = {
    loading: boolean;
    error: GraphqlError[] | null;
    data: UserData | null;
    getUserDataSuccess: boolean;
}

export const useSignedInUserData = ( userToken : string ): SignedInUserState => {
    const [ state, setState ] = useState<SignedInUserState>({
        loading: true,
        error: null,
        data: null,
        getUserDataSuccess: false
    });
    
    useEffect(() => {
        if (userToken == null) return;

        (async () => {
            const result = await fetchGraphQl(getSignedInUserQuery, { token : userToken });
            const data : { getUser :  UserData } = result.data;

            setState({
                loading: false,
                error: result.errors,
                data: data.getUser,
                getUserDataSuccess: result.errors === undefined
            })
        })()
    }, [ userToken ]);
    
    return state;
}