import React, { useState, useEffect } from "react";

import { fetchGraphQl, TrainerVideoSummary } from "../utils";

import { userGetAllTrainerVideo } from "../graphQlQuieries";

export type useUserGetAllTrainerVideoState = {
    loading: boolean;
    error: boolean;
    data: TrainerVideoSummary[]
}

export const useUserGetAllTrainerVideo = ( token: string, trainerId: string ) => {
    const [ state, setState ] = useState<useUserGetAllTrainerVideoState>({
        loading: false,
        error: false, 
        data: []
    });

    useEffect(() => {

        if ( token == null || trainerId == null ) return;

        setState({
            ...state,
            loading: true
        });

        fetchGraphQl(userGetAllTrainerVideo, { token, trainerId })
        .then( req => {
            if ( req.errors ) {
                setState({
                    ...state,
                    loading: false,
                    error: true
                })
            }else {
                let data: { userGetAllTrainerVideo: TrainerVideoSummary[] } = req.data;

                setState({
                    ...state,
                    loading: false,
                    data: data.userGetAllTrainerVideo
                })
            }
        })

    }, [ token, trainerId ])


    return state;
}

