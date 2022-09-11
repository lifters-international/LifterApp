import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGraphQl, JsonToken } from "../../../utils";
import { userLogInMutation } from "../../../graphQlQuieries";
import { LoginAsyncThunkResult } from "./indes.types";

export const logIn = createAsyncThunk(
    "@auth/logIn",
    async (credentials: { username: string, password: string }) : Promise<LoginAsyncThunkResult> => {
        const response = await fetchGraphQl(userLogInMutation, {...credentials});

        if ( response.errors ) return {
            successfull: false,
            errors: response.errors,
            data: null
        };

        let data: { logIn: JsonToken | null } = response.data;

        if ( data.logIn ) return {
            successfull: true,
            errors: null,
            data: data.logIn.token
        };
        
        else return {
            successfull: false,
            errors: null,
            data: null
        };
    }
);