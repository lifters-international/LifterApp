import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { Auth } from "./features";

export const store = configureStore({
    reducer: {
        Auth,
    },
});

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();