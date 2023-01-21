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
        loading: true,
        error: null,
        whoSent: null
    });

    useEffect(() => {
        if ( token == null ) return;

        fetchGraphQl( getUserMessages, { token, matchId } ).then( result => {
            let data : GetUserMessagesResult = result.data;

            if ( result.errors ) {
                setState( prevState => ( { ...prevState, error: result.errors, loading: false } ) );
            }else {
                setState( prevState => (
                    {
                        ...prevState,
                        userMessages: data.getUserMessages.messages,
                        whoSent: data.getUserMessages.whoIsUser,
                        loading: false,
                        sendMessage: ( token, matchId, message, metaDataType ) => {
                            socket.messagesEmit( "sendMessage", { token, matchId, message, metaDataType } );
                        },

                        sendReadMessage: ( messageId ) => {
                            socket.messagesEmit("sendReadMessage", { messageId, token, matchId })
                        }
                    }
                ));

                socket.onMessages("NewMessage", ( newMessage: { matchId: string, message: Message }) => {
                    if ( newMessage.matchId === matchId ) {

                        setState(prevState => (
                            {
                                ...prevState,
                                userMessages: [...(prevState.userMessages || []), newMessage.message]
                            }
                        ));
                    }
                });
            }
        })
    }, [ ]);

    return state;
}