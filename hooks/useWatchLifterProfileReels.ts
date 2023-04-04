import React, { useState, useEffect, useMemo } from "react";

import { fetchGraphQl, GetLoggedInUserHomePageDetails, GraphqlError, socket, WatchLifterProfileReelsComments, WatchLifterProfileReelsCommentsChildren } from "../utils";

import { getLoggedInUserHomePageDetails } from "../graphQlQuieries";

export type WatchLifterProfileReelsDetailsState = {
    loading: boolean;
    errors: GraphqlError[];
    getReelsInformation: (reel: string, userId: string) => void;
    likeReel: (reel: string, userId: string) => void;
    saveReel: (reel: string, userId: string) => void;
    shareReel: (reel: string, userId: string) => void;
    updateCaption: (reel: string, caption: string, userId: string) => void;
    deleteReel: (reel: string, userId: string) => void;
    downloadReel: (reel: string, userId: string) => void;
    getParentComments: (reel: string) => void;
    askForChildren: (reel: string, parentComment: string) => void;
    postComment: ( reel: string, userId: string, comment: string, parentId?: string ) => void;
}

export type MangerListener = {
    id: string;
    emit: (args?: any) => void;
}

export enum ManagerListenerEvents {
    newReelLike = "newReelLike",
    newReelSave = "newReelSave",
    reelCaptionUpdated = "reelCaptionUpdated",
    reelInformationResponse = "reelInformationResponse",
    parentComments = "parentComments",
    childComments = "childComments",
    newComment = "newComment",
    newChildComment = "newChildComment",
    newReelShare = "newReelShare"
};

export const useWatchLifterProfileReels = (token: string) => {
    const [state, setState] = useState<WatchLifterProfileReelsDetailsState>({
        loading: true,
        errors: [],
        getReelsInformation: (reel: string, userId: string) => { },
        likeReel: (reel: string, userId: string) => { },
        saveReel: (reel: string, userId: string) => { },
        shareReel: (reel: string, userId: string) => { },
        updateCaption: (reel: string, caption: string, userId: string) => { },
        deleteReel: (reel: string, userId: string) => { },
        downloadReel: (reel: string, userId: string) => { },
        getParentComments: (reel: string) => { },
        askForChildren: (reel: string, parentComment: string) => { },
        postComment: ( reel: string, userId: string, comment: string, parentId?: string ) => { }
    });

    const [data, setData] = useState<GetLoggedInUserHomePageDetails | undefined>();

    const socketManagerListener = useMemo<{ [ key in ManagerListenerEvents]: MangerListener[] }>(
        () => ({
            parentComments: [],
            reelInformationResponse: [],
            newReelLike: [],
            newReelSave: [],
            reelCaptionUpdated: [],
            childComments: [],
            newComment: [],
            newChildComment: [],
            newReelShare: []
        })    
    , []);

    useEffect(() => {
        if (token == null) return;

        fetchGraphQl(getLoggedInUserHomePageDetails, { token })
            .then(res => {
                if (res.errors) {
                    setState(prev => ({
                        ...prev,
                        loading: false,
                        errors: res.errors
                    }))
                } else {
                    setData(prev => ({
                        ...prev,
                        ...res.data.getLoggedInUserHomePageDetails,
                    }));

                    setState(prev => ({
                        ...prev,
                        loading: false,

                        getReelsInformation: (reel: string, userId: string) => {
                            socket.reelsEmit("reelInformation", { reel, userId });
                        },

                        likeReel: (reel: string, userId: string) => {
                            socket.reelsEmit("likeReel", { reel, userId });
                        },

                        saveReel: (reel: string, userId: string) => {
                            socket.reelsEmit("saveReel", { reel, userId });
                        },

                        shareReel: (reel: string, userId: string) => { 
                            socket.reelsEmit("shareReel", { reel, userId });
                        },

                        updateCaption: (reel: string, caption: string, userId: string) => {
                            socket.reelsEmit("updateCaption", { reel, caption, userId });
                        },

                        deleteReel: (reel: string, userId: string) => {
                            socket.reelsEmit("deleteReel", { reel, userId });
                        },

                        downloadReel: (reel: string, userId: string) => {
                            socket.reelsEmit("downloadReel", { reel, userId });
                        },

                        getParentComments: (reel: string) => {
                            socket.reelsEmit("getParentComments", { reel });
                        },

                        askForChildren: (reel: string, parentComment: string) => {
                            socket.reelsEmit("getChildComments", { reel, parentComment });
                        },

                        postComment: ( reel: string, userId: string, comment: string, parentId?: string ) => {
                            socket.reelsEmit("postComment", { reel, userId, comment, parentId });
                        }
                    }));

                }
            })
    }, [token]);

    useEffect(() => {
        socket.onReels("reelInformationResponse", (reelsInformation: { reel: string, likeCount: number, commentsCount: number, sharesCount: number, savesCount: number, downloadsCount: number, ownerProfilePicture: string, ownerName: string, userLiked: boolean, userSaved: boolean }) => {
            socketManagerListener.reelInformationResponse.find( sub => sub.id === reelsInformation.reel )?.emit(reelsInformation); 
        });

        socket.onReels("newReelLike", (reelLikeEvent: { reel: string, userId: string, like: boolean }) => {
            socketManagerListener.newReelLike.find( sub => sub.id === reelLikeEvent.reel )?.emit(reelLikeEvent);
        });

        socket.onReels("newReelSave", (reelLikeSave: { reel: string, userId: string, save: boolean }) => {
            socketManagerListener.newReelSave.find( sub => sub.id === reelLikeSave.reel )?.emit(reelLikeSave);
        });

        socket.onReels("reelCaptionUpdated", (reelsCaptionUpdatedEvent: { reel: string, caption: string }) => {
            socketManagerListener.reelCaptionUpdated.find( sub => sub.id === reelsCaptionUpdatedEvent.reel )?.emit(reelsCaptionUpdatedEvent);
        });

        socket.onReels('parentComments', (parentCommentsEvent: { reel: string, comments: WatchLifterProfileReelsComments[] }) => {
            socketManagerListener.parentComments.find( sub => sub.id === parentCommentsEvent.reel )?.emit( parentCommentsEvent );
        });

        socket.onReels("childComments", ( childCommentsEvent: { reel: string, parentComment: string, childComments: WatchLifterProfileReelsCommentsChildren[] } ) => {
            socketManagerListener.childComments.find( sub => sub.id === childCommentsEvent.reel )?.emit( childCommentsEvent );
        });

        socket.onReels("newComment", ( newCommentEvent: { id: string, comment: string, reel: string, user : string, liftersProfilePicture: string, liftersName: string, updated_at: number } ) => {
            socketManagerListener.newComment.find( sub => sub.id === newCommentEvent.reel )?.emit( newCommentEvent );
        })

        socket.onReels("newChildComment", ( newChildCommentEvent : { id: string, comment: string, reel: string, user : string, liftersProfilePicture: string, liftersName: string, updated_at: number, parentId: string, parent: string, ancestorId: string } ) => {
            socketManagerListener.newChildComment.find( sub => sub.id === newChildCommentEvent.reel )?.emit( newChildCommentEvent );
        });

        socket.onReels("newReelShare", ( newReelShareEvent : { reel: string }) => {
            socketManagerListener.newReelShare.find( sub => sub.id === newReelShareEvent.reel )?.emit( newReelShareEvent );
        });

        socket.onReels("reelDeleted", (reelDeletedEvent: { reel: string }) => {
            setData(prev => ({
                ...prev!,
                reels: (
                    () => {
                        let oldReels = prev!.reels;

                        let index = oldReels?.findIndex(reels => reels.id === reelDeletedEvent.reel);

                        if (index !== -1 && index !== undefined) oldReels.splice(index, 1);

                        return oldReels;
                    }
                )()
            }))
        });
    }, []);
    
    return {
        ...state,

        data,

        subscribeToEvent: (event: ManagerListenerEvents, listener: MangerListener) => {
            socketManagerListener[event]?.push(listener);
        },

        unSubscribeToEvent: (event: ManagerListenerEvents, id: string) => {
            socketManagerListener[event] = ( socketManagerListener[event] as MangerListener[] ).filter( (sub) => sub.id !== id );
        }
    };
}
