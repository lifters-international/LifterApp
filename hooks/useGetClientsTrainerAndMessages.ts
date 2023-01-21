import React, { useState, useEffect, useRef } from "react";

import { getClientTrainersAndMessages } from "../graphQlQuieries";

import { TrainersClientDetails, fetchGraphQl, GraphqlError, TrainersDecision, TrainersClientMessage, socket } from "../utils";

export type ClientTrainersAndMessageDetailsState = {
    name: string;
    profilePicture: string;
    trainersDecision: TrainersDecision;
    dateCreated: number;
    canSeeUserFoodHistory: boolean;
    trainer: string;
}

export type ClientTrainersAndMessageState = {
    details: ClientTrainersAndMessageDetailsState;
    messages: TrainersClientMessage[];
    error: GraphqlError[];
    loading: boolean;
    sendReadMessage?: ( messageId: string ) => void;
    sendMessage?: ( token: string, message: string, metaDataType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" ) => void;
}

export const useGetClientsTrainerAndMessages = ( token : string, clientId : string ) => {
    const [ details, setDetails ] = useState<ClientTrainersAndMessageDetailsState>({
        name: "",
        profilePicture: "",
        trainersDecision: TrainersDecision.ACCEPTED,
        dateCreated: 0,
        canSeeUserFoodHistory: false,
        trainer: ""
    });

    const [ messages, setMessages ] = useState<TrainersClientMessage[]>([]);

    const [ error, setError ] = useState<GraphqlError[]>([]);

    const [ loading, setLoading ] = useState<boolean>(true);

    const [ messageSendState, setMessageSendState ] = useState({
        sendMessage: ( token: string, message: string, metaDataType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" ) => {},

        sendReadMessage: ( messageId: string ) => {}
    });

    useEffect(() => {
        if ( token === null || clientId === null ) return;

        fetchGraphQl( getClientTrainersAndMessages, { token, clientId })
        .then( res => {
            setLoading(false);
        
            if ( res.errors ) {
                setError(res.errors);
            } else {
                let data : { trainer : string } & TrainersClientDetails = res.data.getClientTrainersAndMessages;

                setDetails(prev => {
                    return {
                        ...prev,
                        name: data.name,
                        profilePicture: data.profilePicture,
                        trainersDecision: data.trainersDecision,
                        dateCreated: data.dateCreated,
                        canSeeUserFoodHistory: data.canSeeUserFoodHistory,
                        trainer: data.trainer
                    }
                });

                setMessages(data.messages);

                socket.onTrainerClient("NewMessage", ( NewMessage: { trainerClientId: string, message: TrainersClientMessage }) => {
                    if ( NewMessage.trainerClientId === clientId ) setMessages(prev => {
                        return [...prev, NewMessage.message];
                    })
                });

                setMessageSendState( prev => {
                    return {
                        ...prev,
                        sendMessage: ( token: string, message: string, metaDataType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" ) => {
                            socket.trainerClientEmit("sendMessage", { token, tokenType: "lifters", trainerClientId: clientId, message, metaDataType });
                        },

                        sendReadMessage: ( messageId: string ) => {
                            socket.trainerClientEmit("sendReadMessage", { token, tokenType: "lifters", trainerClientId: clientId, messageId })
                        }
                    }
                });
            }

        })
    }, [ token, clientId ]);

    return {
        details,
        messages,
        error,
        loading,
        ...messageSendState
    }
}
