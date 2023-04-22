import React, { useState, useEffect, useMemo } from "react";

import { fetchGraphQl, ReelsManagerListenerEvents, ReelsMangerListener, GetLoggedInUserHomePageDetailsReels, socket, WatchLifterProfileReelsComments, WatchLifterProfileReelsCommentsChildren, UserData } from "../utils";
import { getSignedInUserQuery } from "../graphQlQuieries";

export type ReelsDetailsState = {
    loading: boolean;
    userId: string;
    profilePicture: string;
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
    createViewHistory: (reel: string) => void;
    updateViewHistory: (reel: string, userId: string, time: number) => void;
    nextReel: (reelId?: string) => void;
}

export const useReels = (token: string, refreshing: boolean) => {
    const [state, setState] = useState<ReelsDetailsState>({
        loading: true,
        userId: "",
        profilePicture: "",
        getReelsInformation: (reel: string, userId: string) => { },
        likeReel: (reel: string, userId: string) => { },
        saveReel: (reel: string, userId: string) => { },
        shareReel: (reel: string, userId: string) => { },
        updateCaption: (reel: string, caption: string, userId: string) => { },
        deleteReel: (reel: string, userId: string) => { },
        downloadReel: (reel: string, userId: string) => { },
        getParentComments: (reel: string) => { },
        askForChildren: (reel: string, parentComment: string) => { },
        postComment: ( reel: string, userId: string, comment: string, parentId?: string ) => { },
        createViewHistory: (reel: string) => { },
        updateViewHistory: (reel: string, userId: string, time: number) => { },
        nextReel: ( reelId?: string ) => { },
    });

    const [reels, setReels] = useState<GetLoggedInUserHomePageDetailsReels[]>([]);

    const socketManagerListener = useMemo<{ [key in ReelsManagerListenerEvents]: ReelsMangerListener[] }>(
        () => ({
            parentComments: [],
            reelInformationResponse: [],
            newReelLike: [],
            newReelSave: [],
            reelCaptionUpdated: [],
            childComments: [],
            newComment: [],
            newChildComment: [],
            newReelShare: [],
            viewHistoryToken: []
        })
        , []);

    useEffect(() => {
        if (token == null || !refreshing) return;

        const fetchData = async () => {
            const result = await fetchGraphQl(getSignedInUserQuery, { token });
            const data: { getUser: UserData } = result.data;

            const { id: userId, profilePicture } = data.getUser;

            // Start sending events
            setState(prev => ({
                ...prev,
                loading: false,

                userId,

                profilePicture,

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
                },

                createViewHistory: (reel: string) => {
                    socket.reelsEmit("createViewHistory", { reel, userId });
                },

                updateViewHistory: (reel: string, userId: string, time: number) => {
                    socket.reelsEmit("updateViewTime", { reel, userId, time });
                },

                nextReel: ( reelId?: string ) => {
                    socket.reelsEmit("nextReelReco", { reelId: reelId || "", userId });
                },
            }));

            // Get Reels
            socket.reelsEmit("startReelReco", { userId });
        }


        fetchData();

    }, [token, refreshing]);

    useEffect(() => {
        // render gotten reels
        socket.onReels("initialRecommendedReels", ( reelsEvent : GetLoggedInUserHomePageDetailsReels[] ) => {
            setReels(reelsEvent);
        });

        socket.onReels("reelRecommendation", ( newReelsEvent : GetLoggedInUserHomePageDetailsReels[] ) => {
            setReels( prev => {
                prev.push(...newReelsEvent);
                return prev;
            })
        })

        socket.onReels("reelInformationResponse", (reelsInformation: { reel: string, likeCount: number, commentsCount: number, sharesCount: number, savesCount: number, downloadsCount: number, ownerProfilePicture: string, ownerName: string, userLiked: boolean, userSaved: boolean }) => {
            socketManagerListener.reelInformationResponse.find(sub => sub.id === reelsInformation.reel)?.emit(reelsInformation);
        });

        socket.onReels("newReelLike", (reelLikeEvent: { reel: string, like: boolean }) => {
            socketManagerListener.newReelLike.find(sub => sub.id === reelLikeEvent.reel)?.emit(reelLikeEvent);
        });

        socket.onReels("newReelSave", (reelLikeSave: { reel: string, save: boolean }) => {
            socketManagerListener.newReelSave.find(sub => sub.id === reelLikeSave.reel)?.emit(reelLikeSave);
        });

        socket.onReels("reelCaptionUpdated", (reelsCaptionUpdatedEvent: { reel: string, caption: string }) => {
            socketManagerListener.reelCaptionUpdated.find(sub => sub.id === reelsCaptionUpdatedEvent.reel)?.emit(reelsCaptionUpdatedEvent);
        });

        socket.onReels('parentComments', (parentCommentsEvent: { reel: string, comments: WatchLifterProfileReelsComments[] }) => {
            socketManagerListener.parentComments.find(sub => sub.id === parentCommentsEvent.reel)?.emit(parentCommentsEvent);
        });

        socket.onReels("childComments", (childCommentsEvent: { reel: string, parentComment: string, childComments: WatchLifterProfileReelsCommentsChildren[] }) => {
            socketManagerListener.childComments.find(sub => sub.id === childCommentsEvent.reel)?.emit(childCommentsEvent);
        });

        socket.onReels("newComment", (newCommentEvent: { id: string, comment: string, reel: string, user: string, liftersProfilePicture: string, liftersName: string, updated_at: number }) => {
            socketManagerListener.newComment.find(sub => sub.id === newCommentEvent.reel)?.emit(newCommentEvent);
        })

        socket.onReels("newChildComment", (newChildCommentEvent: { id: string, comment: string, reel: string, user: string, liftersProfilePicture: string, liftersName: string, updated_at: number, parentId: string, parent: string, ancestorId: string }) => {
            socketManagerListener.newChildComment.find(sub => sub.id === newChildCommentEvent.reel)?.emit(newChildCommentEvent);
        });

        socket.onReels("newReelShare", (newReelShareEvent: { reel: string }) => {
            socketManagerListener.newReelShare.find(sub => sub.id === newReelShareEvent.reel)?.emit(newReelShareEvent);
        });

        socket.onReels("viewHistoryToken", (newViewHistoryTokenEvent: { token: string, reel: string }) => {
            socketManagerListener.viewHistoryToken.find(sub => sub.id === newViewHistoryTokenEvent.reel)?.emit(newViewHistoryTokenEvent);
        });

        socket.onReels("reelDeleted", (reelDeletedEvent: { reel: string }) => {
            setReels(prev => {
                let oldReels = prev;

                let index = oldReels?.findIndex(reels => reels.id === reelDeletedEvent.reel);

                if (index !== -1 && index !== undefined) oldReels.splice(index, 1);

                return oldReels;
            })
        });
    }, []);

    return {
        ...state,

        reels,

        subscribeToEvent: (event: ReelsManagerListenerEvents, listener: ReelsMangerListener) => {
            socketManagerListener[event]?.push(listener);
        },

        unSubscribeToEvent: (event: ReelsManagerListenerEvents, id: string) => {
            socketManagerListener[event] = ( socketManagerListener[event] as ReelsMangerListener[] ).filter( (sub) => sub.id !== id );
        }
    };
}
