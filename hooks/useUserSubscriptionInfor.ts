import React, { useState } from "react";

import { getUserSubscriptionInfor } from "../graphQlQuieries";

import { UserSubscriptionInfor, fetchGraphQl, UserSubscriptionInforResult } from "../utils";

export type UserSubscriptionInforState = {
    result?: UserSubscriptionInfor;
    loading: boolean;
    error?: any;
    refresh: () => void;
}

export const useUserSubscriptionInfor = ( token : string ): UserSubscriptionInforState => {
    const [ state, setState ] = useState<UserSubscriptionInforState>( {
        loading: false,
        error: [],
        refresh: () => { }
    } );

    React.useEffect( () => {
        loadData()
    }, [ token ] );

    const loadData = () => {
        if ( token == null ) return;

        setState( prevState => (
            {
                ...prevState,
                loading: true
            }
        ));

        fetchGraphQl( getUserSubscriptionInfor, { token } ).then( result => {
            let data : UserSubscriptionInforResult = result.data;

            if ( result.errors ) {
                setState( prevState => (
                    {
                        ...prevState,
                        loading: false,
                        error: result.errors
                    }
                ));
            } else {
                setState( prevState => (
                    {
                        ...prevState,
                        loading: false,
                        result: data.getUserSubscriptionInfor,
                        refresh: loadData
                    }
                ));
            }
        })
    }

    return state;
}