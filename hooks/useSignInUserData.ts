import React from 'react';
import { fetchGraphQl, GraphqlError, UserData } from '../utils';
import { getSignedInUserQuery } from '../graphQlQuieries';

export type SignInUserState = {
    loading: boolean;
    error: GraphqlError[];
    data?: UserData;
    getUserDataSuccess: boolean;
}

export const useSignInUserData = (userToken: string) => {
    const [state, setState] = React.useState<SignInUserState>({
        loading: true,
        error: [],
        getUserDataSuccess: false,
    });

    React.useEffect(() => {
        if (userToken == null) return;

        setState(prevState => {
            return {
                ...prevState,
                loading: true,
            };
        });
        
        const fetchData = async () => {
            const result = await fetchGraphQl(getSignedInUserQuery, { token: userToken });
            const data: { getUser: UserData } = result.data;
            setState({
                ...state,
                loading: false,
                error: result.errors,
                data: data.getUser,
                getUserDataSuccess: result.errors !== undefined ? false : true
            });
        }
        fetchData();
    }, [userToken]);

    return state;
}
