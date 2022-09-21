import { AuthState } from "./indes.types";
import type { PayloadAction } from "@reduxjs/toolkit"; 
import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
    token: '',
    tokenVerified: false,
    username: '',
    password: '',
    profilePicture: "../assets/defaultPicture.png",
    AppReady: true
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

        setAuthState: (state, action: PayloadAction<{
            token: string;
            tokenVerified: boolean;
            username: string;
            password: string;
        }>) => {
            return {
                ...state,
                token: action.payload.token,
                tokenVerified: action.payload.tokenVerified,
                username: action.payload.username,
                password: action.payload.password
            }
        },

        setProfilePicture: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                profilePicture: action.payload
            }
        },

        setAppReady: (state, action: PayloadAction<boolean>) => {
            return {
                ...state,
                AppReady: action.payload
            }
        }
    }
});

export const { setToken, setAuthState, setProfilePicture, setAppReady } = AuthSlice.actions;
export default AuthSlice.reducer;