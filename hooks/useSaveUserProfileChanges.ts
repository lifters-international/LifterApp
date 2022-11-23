import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux";
import { setAuthState, setProfilePicture } from "../redux/features/auth";
import { fetchGraphQl, GraphqlError, RequestResult, delay, userInformationToSave, saveToStore, getServerUrl } from '../utils';
import { updateUserInformationMutation } from "../graphQlQuieries";

import { Alert } from 'react-native';

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
    const dispatch = useAppDispatch();
    const { profilePicture, username, password } = useSelector((state: any) => state.Auth);
    
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

                // Change occured so now we want to update the redux store
                if (
                    params.userInfor.profilePicture != profilePicture ||  
                    params.userInfor.username != username 
                ) {
                    
                    if ( params.userInfor.username != username && params.userInfor.username ) {
                        await saveToStore("username", params.userInfor.username!);
                        dispatch(setAuthState({
                            token: params.token,
                            username: params.userInfor.username!,
                            tokenVerified: true,
                            password: password
                        }));
                    }

                    if ( params.userInfor.profilePicture != profilePicture && params.userInfor.profilePicture ) dispatch( 
                        setProfilePicture(
                            getServerUrl() + "image/" + params.userInfor.profilePicture!
                        ) 
                    );
                 
                }
            } else if ( data.updateUserInformation.type == "failed" ) {
                setState(prevState => {
                    return {
                        ...prevState,
                        isSaving: false,
                    }
                });

                return Alert.alert("Failed to save", data.updateUserInformation.value);
            }
        }
    });
    
    return state;
}