import React, { useEffect, useState } from "react";

import { getUserMessages } from "../graphQlQuieries";
import { GetUserMessagesResult, fetchGraphQl, Message, MessageWhoSent, MessageMetaDataType, socket } from "../utils";

export type UserMessagesState = {
    userMessages: Message[] | null;
    loading: boolean;
    whoSent: MessageWhoSent | null;
    error: any;
    sendReadMessage?: ( messageId: string ) => void;
    sendMessage?: ( token: string, matchId: string, message: string, metaDataType: MessageMetaDataType) => void;
}

export const useGetUserMessages = ( token : string, matchId : string ) : UserMessagesState => {
    const [ state, setState ] = useState<UserMessagesState>({
        userMessages: null,
        loading: false,
        error: null,
        whoSent: null
    });

    useEffect(() => {
        if ( token == null ) return;
        
        setState( prevState => ( { ...prevState, loading: true } ) );

        fetchGraphQl( getUserMessages, { token, matchId } ).then( result => {
            let data : GetUserMessagesResult = result.data;

            if ( result.errors ) {
                setState( prevState => ( { ...prevState, error: result.errors, loading: false } ) );
            }else {
                setState( prevState => (
                    {
                        ...prevState,
                        userMessages: data.getUserMessages.messages.sort( (a, b) => Number(a.createdAt) - Number(b.createdAt) ),
                        whoSent: data.getUserMessages.whoIsUser,
                        loading: false,
                        sendMessage: ( token, matchId, message, metaDataType ) => {
                            socket.emit( "sendMessage", { token, matchId, message, metaDataType } );
                        },

                        sendReadMessage: ( messageId ) => {
                            socket.emit("sendReadMessage", { messageId, token, matchId })
                        }
                    }
                ));

                socket.on("NewMessage", ( newMessage: { matchId: string, message: Message }) => {
                    if ( newMessage.matchId === matchId ) {
                        setState(prevState => (
                            {
                                ...prevState,
                                userMessages: [...(prevState.userMessages || []), newMessage.message].sort( (a, b) => Number(a.createdAt) - Number(b.createdAt)),
                            }
                        ));
                    }
                });
            }
        })
    }, [ token, matchId ]);

    return state;
}