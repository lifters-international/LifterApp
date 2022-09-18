import React, { useEffect, useState } from 'react';

import { newUserMatchesSubscription, getUserUnAcceptedMatches } from '../graphQlQuieries';
import { useSubscription } from '@apollo/client';
import { newUserSubscriptionMatches, /*client,*/ fetchGraphQl, SubscriptionType, newUserMatches, socket } from "../utils";

export type UserMatchesSubscription = {
    loading: boolean;
    error: any;
    data?: newUserSubscriptionMatches;
}

export const useUserMatchesSubscription = (token : string, reload: boolean) : UserMatchesSubscription => {
    const [ state, setState ] = useState<UserMatchesSubscription>({
        loading: false,
        error: []
    });

    useEffect(() => {
        if ( token == null ) return;

        setState(prevState => {
            return {
                ...prevState,
                loading: true
            }
        });

        fetchGraphQl(getUserUnAcceptedMatches, {token}).then( result => {
            let data:  { getUserUnAcceptedMatches: newUserSubscriptionMatches } = result.data;

            if ( result.errors ) {
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        error: result.errors
                    }
                });
            }else {
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        data: data.getUserUnAcceptedMatches
                    }
                });
            }
        })
    }, [token]);

    useEffect(() => {
        if ( token == null || !reload ) return;
        
        fetchGraphQl(getUserUnAcceptedMatches, {token}).then( result => {
            let data:  { getUserUnAcceptedMatches: newUserSubscriptionMatches } = result.data;

            if ( result.errors ) {
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        error: result.errors
                    }
                });
            }else {
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        data: data.getUserUnAcceptedMatches
                    }
                });

                socket.on("newUserMatches", ( datas : { forYou : boolean } & newUserMatches ) => {
                    if ( datas.forYou ) setState(prevState => (
                        {
                            ...prevState,
                            data: {
                                ...prevState.data!,
                                matches: [...(prevState.data?.matches || []), {
                                    ...datas,
                                    forYou: undefined
                                }]
                            } 
                        }
                    ))
                })
            }
        })
    }, [reload]);

    return state;
}