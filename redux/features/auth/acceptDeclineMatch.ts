import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGraphQl, GraphqlError } from "../../../utils";
import { acceptDeclineMatch } from "../../../graphQlQuieries";

export type acceptDeclineMatchProps = {
    token: string;
    matchId: string;
    accept: boolean;
    callback?: (result: string) => void;
    err?: (error : GraphqlError[]) => void;
}

export const acceptDeclineMatchThunk = createAsyncThunk(
    "@auth/acceptDeclineMatch",
    async ( { token, matchId, accept, callback, err } : acceptDeclineMatchProps ) => {
        const response = await fetchGraphQl(acceptDeclineMatch, { token, matchId, accept });

        if ( response.errors && err ) return err(response.errors);

        if ( callback ) callback(
           ( response.data as { acceptDeclineMatch: string } ).acceptDeclineMatch
        );
    }

)