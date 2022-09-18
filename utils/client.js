import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client";

import { getMainDefinition } from '@apollo/client/utilities';

import { HttpLink } from "apollo-link-http";

import { WebSocketLink } from "@apollo/client/link/ws";

import { getApiUrl, getWSApiUrl } from "./url";

const httpLink = new HttpLink({
    uri: getApiUrl()
});

const wsLink = new WebSocketLink({
    uri: getWSApiUrl(),
    options: {
        reconnect: true
    }   
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink
);

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([splitLink])
})