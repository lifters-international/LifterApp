import React, { useState, useEffect } from "react";

import { fetchGraphQl, GetLoggedInUserHomePageDetails, GraphqlError, socket } from "../utils";

import { getLoggedInUserHomePageDetails } from "../graphQlQuieries";

export type WatchLifterProfileReelsDetailsState = {
    loading: boolean;
    errors: GraphqlError[];
    getReelsInformation: ( reel: string, userId: string ) => void;
    likeReel: ( reel: string, userId: string ) => void;
    saveReel: ( reel: string, userId: string ) => void;
    updateCaption: ( reel: string, caption : string, userId: string ) => void;
    deleteReel: ( reel: string, userId: string ) => void;
    downloadReel: (reel: string, userId: string) => void;
}

export const useWatchLifterProfileReels = ( token: string ) => {
    const [ state, setState ] = useState<WatchLifterProfileReelsDetailsState>({
        loading: true,
        errors: [],
        getReelsInformation: ( reel: string, userId: string ) => {},
        likeReel: ( reel: string, userId: string ) => {},
        saveReel: ( reel: string, userId: string ) => {},
        updateCaption: ( reel: string, caption : string, userId: string ) => {},
        deleteReel: ( reel: string, userId: string ) => {},
        downloadReel: ( reel: string, userId: string ) => {}
    });

    const [ data, setData ] = useState<GetLoggedInUserHomePageDetails | undefined>();

    useEffect(() => {
        if ( token == null ) return;

        fetchGraphQl(getLoggedInUserHomePageDetails, { token })
        .then( res => {
            if ( res.errors ) {
                setState( prev => ({
                    ...prev,
                    loading: false,
                    errors: res.errors
                }))
            }else {
                setData( prev => ({
                    ...prev,
                    ...res.data.getLoggedInUserHomePageDetails,
                }));

                setState( prev => ({
                    ...prev,
                    loading: false,

                    getReelsInformation: ( reel: string, userId: string ) => {
                        socket.reelsEmit("reelInformation", { reel, userId });
                    },

                    likeReel: ( reel: string, userId: string ) => {
                        socket.reelsEmit("likeReel", { reel, userId });
                    },

                    saveReel: ( reel: string, userId: string ) => {
                        socket.reelsEmit("saveReel", { reel, userId });
                    },

                    updateCaption: ( reel: string, caption : string, userId: string ) => {
                        socket.reelsEmit("updateCaption", { reel, caption, userId });
                    },
                    
                    deleteReel: ( reel: string, userId: string ) => {
                        socket.reelsEmit("deleteReel", { reel, userId });
                    },

                    downloadReel: (  reel : string, userId: string ) => {
                        socket.reelsEmit("downloadReel", { reel, userId });
                    }
                }));

            }
        })
    }, [ token ]);

    useEffect(() => {
        socket.onReels("reelInformationResponse", ( reelsInformation : { reel: string, likeCount : number, commentsCount: number, sharesCount: number, savesCount: number, downloadsCount: number, ownerProfilePicture: string, ownerName: string, userLiked: boolean, userSaved: boolean }) => {
            setData( prev => ({
                ...prev!,
                reels: (
                    () => {
                        let oldReels = prev!.reels;

                        let index = oldReels?.findIndex( reels => reels.id === reelsInformation.reel );

                        if ( index !== -1 && index !== undefined ) {
                            oldReels?.splice(
                                index,
                                1,
                                (
                                    () => {
                                        return {
                                            ...oldReels[index],
                                            ...reelsInformation,
                                            reel: undefined
                                        } 
                                    }
                                )()
                            )
                        }

                        return oldReels;
                    }
                )()
            }));
        });

        socket.onReels("newReelLike", ( reelLikeEvent : { reel: string, userId: string, like: boolean }) => {
            setData( prev => ({
                ...prev!,
                reels: (
                    () => {
                        let oldReels = prev!.reels;

                        let index = oldReels?.findIndex( reels => reels.id === reelLikeEvent.reel );

                        if ( index !== -1 && index !== undefined ) {
                            oldReels.splice(
                                index,
                                1,
                                (
                                    () => {
                                        let likesCount = ( oldReels[index].likesCount || 0 ) + ( reelLikeEvent.like === true ? 1 : -1 );

                                        likesCount = likesCount > 0 ? likesCount : 0;

                                        return {
                                            ...oldReels[index],
                                            likesCount,
                                            userLiked: prev!.id !== reelLikeEvent.userId ? 
                                                oldReels[index].userLiked : 
                                                reelLikeEvent.like === false ? false : true
                                        }
                                    }
                                )()
                            )
                        }

                        return oldReels;
                    }
                )()
            }))
        });

        socket.onReels("newReelSave", ( reelLikeEvent : { reel: string, userId: string, save: boolean }) => {
            setData( prev => ({
                ...prev!,
                reels: (
                    () => {
                        let oldReels = prev!.reels;

                        let index = oldReels?.findIndex( reels => reels.id === reelLikeEvent.reel );

                        if ( index !== -1 && index !== undefined ) {
                            oldReels.splice(
                                index,
                                1,
                                (
                                    () => {
                                        let savesCount = ( oldReels[index].likesCount || 0 ) + ( reelLikeEvent.save === true ? 1 : -1 );

                                        savesCount = savesCount > 0 ? savesCount : 0;

                                        return {
                                            ...oldReels[index],
                                            savesCount,
                                            userSaved: prev?.id !== reelLikeEvent.userId ? 
                                                oldReels[index].userSaved : 
                                                reelLikeEvent.save === false ? false : true
                                        }
                                    }
                                )()
                            )
                        }

                        return oldReels;
                    }
                )()
            }))
        });

        socket.onReels("reelCaptionUpdated", ( reelsCaptionUpdatedEvent : { reel : string, caption: string }) => {
            setData( prev => ({
                ...prev!,
                reels: (
                    () => {
                        let oldReels = prev!.reels;

                        let index = oldReels?.findIndex( reels => reels.id === reelsCaptionUpdatedEvent.reel );

                        if ( index !== -1 && index !== undefined ) {
                            oldReels.splice(
                                index, 1,
                                (
                                    () => ({
                                        ...oldReels[index],
                                        caption: reelsCaptionUpdatedEvent.caption
                                    })
                                )()
                            )
                        }

                        return oldReels;
                    }
                )()
            }))
        });

        socket.onReels("reelDeleted", ( reelDeletedEvent : { reel : string }) => {
            setData( prev => ({
                ...prev!,
                reels: (
                    () => {
                        let oldReels = prev!.reels;

                        let index = oldReels?.findIndex( reels => reels.id === reelDeletedEvent.reel );

                        if ( index !== -1 && index !== undefined ) oldReels.splice( index, 1 );

                        return oldReels;
                    }
                )()
            }))
        });
    }, []);
    return {
        ...state,
        data
    };
}
