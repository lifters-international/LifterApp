import { UserData, GraphqlError } from "../../../utils";

export type AuthState = {
    token: string;
    tokenVerified: boolean;
    username: string;
    password: string;
}

export type LoginAsyncThunkResult = {
    data: string | null;
    errors: any;
    successfull: boolean
}

export type SignUpAsyncThunkResult = {
    successfull: boolean,
    errors: any
}

export type GetSignedUserAsyncThunkResult = {
    data: UserData;
    error: GraphqlError[];
    getUserDataSuccess: boolean;
}
