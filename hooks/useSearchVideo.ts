import React, { useState, useEffect } from "react";

import { fetchGraphQl, TrainerSearchVideoSummary } from "../utils";

import { searchVideos } from "../graphQlQuieries";

export type useSearchVideoState = {
    loading: boolean;
    error: boolean;
    setSearchTerm: (searchTerm: string) => void;
    searchTerm: string;
    data: TrainerSearchVideoSummary[]
}

export const useSearchVideo = ( token: string ) => {
    const [ state, setState ] = useState<useSearchVideoState>({
        loading: false,
        error: false,
        searchTerm: "",
        data: [],
        setSearchTerm: (searchTerm: string) => {
            setState({
                ...state,
                searchTerm
            });
        },
    });

    const SearchFunc = async ( search : string ) => {
        let req = await fetchGraphQl(searchVideos, { search, token });

        let data: { searchVideo: TrainerSearchVideoSummary[] } = req.data;

        if ( req.errors ) {
            setState({
                ...state,
                loading: false,
                error: true
            })
        }else {
            setState({
                ...state,
                loading: false,
                error: false,
                data: data.searchVideo
            })
        }
    }

    useEffect(() => {
        if ( token === null ) return;

        setState({ ...state, loading: true });

        SearchFunc( state.searchTerm );
    }, [ token ]);


    useEffect(() => {
        SearchFunc( state.searchTerm );
    }, [ state.searchTerm ]);

    return state;
}
