import React, { useState } from "react";
import { createLifterReels } from "../graphQlQuieries";

import { fetchGraphQl } from "../utils";

export type UseCreateReelsState = {
    upload: ( params: { url: string, caption: string }) => void;
    loading: boolean;
    doneUploading: boolean;
    error: boolean;
}

export const useCreateReels = ( token: string ) => {
    const [ state, setState ] = useState<UseCreateReelsState>({
        loading: false,
        doneUploading: false,
        error: false,

        upload: ( reelsInput ) => {
            if ( token == null ) return;

            setState( prev => (
                {
                    ...prev,
                    loading: true,
                    doneUploading: false,
                    error: false
                }
            ) );

            fetchGraphQl(createLifterReels, { token, reelsInput })
            .then( (res) => {
                if ( res.errors ) {
                    setState( prev => (
                        {
                            ...prev,
                            loading: false,
                            doneUploading: false,
                            error: true
                        }
                    ) );
                }else {
                    setState( prev => (
                        {
                            ...prev,
                            loading: false,
                            doneUploading: true,
                            error: false
                        }
                    ) );
                }
            })
        }
    });

    return state;
}
