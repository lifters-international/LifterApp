import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
    token: string;
}

const initialState: AuthState = {
    token: "",
}

const AuthSlice =  createSlice({
    name: "@auth",
    initialState,
    reducers: {

    }
});


export const { } = AuthSlice.actions;

export default AuthSlice.reducer;