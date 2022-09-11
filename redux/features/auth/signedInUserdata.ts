import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGraphQl, UserData } from "../../../utils";
import { getSignedInUserQuery } from "../../../graphQlQuieries";

export const getSignedInUser = createAsyncThunk(
    "@auth/getSignedInUser",
    async (token: string, thunkAPI) => {
        const response = await fetchGraphQl(getSignedInUserQuery, {token});
        return  {
            error: response.errors,
            data: (response.data as { getUser : UserData}).getUser,
            getUserDataSuccess: response.errors !== undefined ? false : true
        }
    }   
)