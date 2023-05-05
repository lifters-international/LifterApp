import React, { useState, useEffect } from "react";

import { fetchGraphQl, GetProfiledUserProfileDetails, GraphqlError } from "../utils";

import { getProfiledUserProfileDetails, profiledUserMatchUnmatchUser, userFollowerProfiledUser } from "../graphQlQuieries";

export type ProfiledUserProfileDetailsState = {
    loading: boolean;
    errors: GraphqlError[];
    data?: GetProfiledUserProfileDetails;
    matchUnmantch: () => void;
    followUnfollow: () => void;
}

export const useProfiledUserProfile = (token: string, profiledUserId: string, refreshing: boolean) => {
    const [state, setState] = useState<ProfiledUserProfileDetailsState>({
        loading: true,
        errors: [],
        matchUnmantch: () => { },
        followUnfollow: () => { }
    });

    useEffect(() => {
        if (token == null || !refreshing) return;

        const reload = () => {
            fetchGraphQl(getProfiledUserProfileDetails, { token, profiledUserId })
                .then(res => {
                    if (res.errors) {
                        setState(prev => ({
                            ...prev,
                            loading: false,
                            errors: res.errors
                        }))
                    } else {
                        setState(prev => ({
                            ...prev,
                            loading: false,
                            data: res.data.getProfiledUserProfileDetails,
                            matchUnmantch: () => {
                                setState(prev => ({
                                    ...prev,
                                    loading: true
                                }));

                                fetchGraphQl(profiledUserMatchUnmatchUser, { token, profiledUserId }).then(res => {
                                    setState(prev => ({
                                        ...prev,
                                        loading: false
                                    }));

                                    reload();
                                });
                            },

                            followUnfollow: () => {
                                setState(prev => ({
                                    ...prev,
                                    loading: true
                                }));

                                fetchGraphQl(userFollowerProfiledUser, { token, profiledUserId }).then(res => {
                                    setState(prev => ({
                                        ...prev,
                                        loading: false
                                    }));

                                    reload();
                                });
                            }
                        }))
                    }
                })
        }

        reload();

    }, [token, profiledUserId, refreshing]);

    return state;
}