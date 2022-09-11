import React from 'react';
import { fetchGraphQl, GraphqlError, UserData } from '../utils';
import { getUserMatches } from '../graphQlQuieries';

export type GetUserMatchesState = {
    loading: boolean;
    error: GraphqlError[];
    users?: UserData[];
    refreshTimes: number;
}

export const useGetUserMatches = (token: string): [GetUserMatchesState, React.Dispatch<React.SetStateAction<GetUserMatchesState>>] => {
    const [state, setState] = React.useState<GetUserMatchesState>({
        loading: true,
        error: [],
        refreshTimes: 1
    });

    React.useCallback(() => {
        if (token == null) return;

        setState(prevState => {
            return {
                ...prevState,
                loading: true
            }
        });

        fetchGraphQl(getUserMatches, { token: token, times: state.refreshTimes }).then(result => {
            let data: { getUserMatches: UserData[] } = result.data;
            let users = data.getUserMatches;
            if (result.errors) {
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        error: result.errors
                    }
                });
            } else {
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        users
                    }
                });
            }
        });
    }, []);

    React.useEffect(() => {
        if (token == null) return;

        fetchGraphQl(getUserMatches, { token: token, times: state.refreshTimes }).then(result => {
            let data: { getUserMatches: UserData[] } = result.data;
            if (result.errors) {
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        error: result.errors
                    }
                });
            } else {
                let users = data.getUserMatches;
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        users
                    }
                });
            }
        });
    }, [state.refreshTimes, token]);

    return [state, setState];
}