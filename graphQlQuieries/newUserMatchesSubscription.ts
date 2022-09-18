import { gql } from "@apollo/client";

export const newUserMatchesSubscription = gql`
    subscription NewUserMatches($userToken: String!) {
        newUserMatches(userToken: $userToken) {
            id
            profilePicture
            name
            date
        }
    }
`;  