import React, { useState } from 'react';
import { fetchGraphQl, GraphqlError, RequestResult, delay, userInformationToSave } from '../utils';
import { updateUserInformationMutation } from "../graphQlQuieries";

export type userSaveUserProfileChangesProps = {
    token: string;
    userInfor: userInformationToSave;
}

export type SaveUserInformationState = {
    isSaving: boolean;
    result?: RequestResult;
    error: GraphqlError[];
    saveSuccessfully: boolean;
    save: ( params : userSaveUserProfileChangesProps ) => void;
    saveAsync: ( params : userSaveUserProfileChangesProps ) => Promise<void>;
}

export const useSaveUserProfileChanges = (): SaveUserInformationState => {
    const [ state, setState ] = useState<SaveUserInformationState>({
        isSaving: false,
        saveSuccessfully: false,
        error: [],

        save: ( params : userSaveUserProfileChangesProps ) => {
            state.saveAsync( params );
        },

        saveAsync: async ( params : userSaveUserProfileChangesProps ) => {
            setState(prevState => {
                return {
                    ...prevState,
                    isSaving: true
                }
            });

            const result = await fetchGraphQl(updateUserInformationMutation, params);

            const data : { updateUserInformation : RequestResult } = result.data;

            if ( data.updateUserInformation.type === "successful") {
                setState(prevState => {
                    return {
                        ...prevState,
                        isSaving: false,
                        result: data.updateUserInformation
                    }
                });

                await delay(1000);

                setState(prevState => {
                    return {
                        ...prevState,
                        saveSuccessfully: true
                    }
                });

                await delay(1000);

                setState(prevState => {
                    return {
                        ...prevState,
                        saveSuccessfully: false
                    }
                });
            }
        }
    });
    
    return state;
}