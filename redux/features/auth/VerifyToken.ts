import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGraphQl } from "../../../utils";
import { userHasLoggedInMutation } from "../../../graphQlQuieries";

export const VerifyToken = createAsyncThunk(
    '@auth/verifyToken',
    async (token: string) => {
        if ( token.length == 0 || !token ) return false;

        const response = await fetchGraphQl(userHasLoggedInMutation, { token });

        let data: { isLoggedIn: boolean } = response.data;

        if ( response.errors ) return false;

        else if ( data.isLoggedIn ) return true;
        
        else return false;
    }
);