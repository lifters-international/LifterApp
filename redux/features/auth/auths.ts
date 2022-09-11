import { AuthState } from "./indes.types";
import type { PayloadAction } from "@reduxjs/toolkit"; 
import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
    token: '',
    tokenVerified: false,
    username: '',
    password: '',
}

const AuthSlice =  createSlice({
    name: "@auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                token: action.payload,
                tokenVerified: true
            }
        },

        setAuthState: (state, action: PayloadAction<AuthState>) => {
            return {
                token: action.payload.token,
                tokenVerified: action.payload.tokenVerified,
                username: action.payload.username,
                password: action.payload.password
            }
        }
    }
});

export const { setToken, setAuthState } = AuthSlice.actions;
export default AuthSlice.reducer;