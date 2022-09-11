import { createAsyncThunk } from "@reduxjs/toolkit";
import { RequestResult, fetchGraphQl } from "../../../utils";
import { userSignUpMutation } from "../../../graphQlQuieries";
import { SignUpAsyncThunkResult } from "./indes.types";

export const signUp = createAsyncThunk(
    "@auth/signUp",
    async (credentials: { username: string, email: string, password: string }) : Promise<SignUpAsyncThunkResult> => {
        const response = await fetchGraphQl(userSignUpMutation, {...credentials});
        
        if ( response.errors ) return {
            successfull: false,
            errors: response.errors,
        };

        let data: { signUp: RequestResult | null } = response.data;

        if ( data.signUp ) return {
            successfull: true,
            errors: null,
        };
        
        else return {
            successfull: false,
            errors: null
        };
    
    }

);