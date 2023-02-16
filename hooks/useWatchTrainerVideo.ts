import React, { useState, useEffect, useRef } from "react";

import { fetchGraphQl, WatchTrainerVideoV401, WatchTrainerVideoV401CommentsChildren, socket } from "../utils";

import { watchTrainerVideoV401 } from "../graphQlQuieries";

export type WatchTrainerVideoState = {
    loading: boolean;
    error: string;
    videoData?: {
        likedVideo: boolean;
        dislikedVideo: boolean;
    } & WatchTrainerVideoV401;

    likeVideo: () => void,
    disLikeVideo: () => void;
    postComment: (comment: string, parentId?: string) => void;
    updateTime: (time: number) => void;
    askForChildren: (originalAncestor: string) => void;
    removeChildren: ( originalAncestor: string ) => void;
}

export const useWatchTrainerVideo = (token: string, videoId: string) => {
    const ran = useRef(0);
    let running = false;

    const [state, setState] = useState<WatchTrainerVideoState>({
        loading: true,
        error: "",
        likeVideo: () => { },
        disLikeVideo: () => { },
        postComment: (comment: string) => { },
        updateTime: (time: number) => { },
        askForChildren: (originalAncestor: string) => { },
        removeChildren: (originalAncestor: string) => { }
    });

    useEffect(() => {
        if (token === null || videoId === null || ran.current === 1 || running) return;

        fetchGraphQl(watchTrainerVideoV401, { token, videoId })
            .then(res => {
                ran.current++;

                if (res.errors) {
                    setState({
                        ...state,
                        error: res.errors[0].message,
                        loading: false
                    })
                } else {
                    setState(prev => {
                        return {
                            ...prev,
                            loading: false,

                            likeVideo: () => {
                                socket.videoEmit("likeVideo", { token, tokenType: "lifters", videoId })
                            },

                            disLikeVideo: () => {
                                socket.videoEmit("dislikeVideo", { token, tokenType: "lifters", videoId })
                            },

                            postComment: (comment: string, parentId?: string) => {
                                socket.videoEmit("postComment", { token, tokenType: "lifters", videoId, comment, parentId })
                            },

                            updateTime: (time: number) => {
                                socket.videoEmit("updateVideoTime", { token, tokenType: "lifters", time, videoId, viewHistoryId: res.data.WatchTrainerVideo.viewHistoryId! })
                            },

                            askForChildren: (originalAncestor: string) => {
                                socket.videoEmit('askForOriginalCommentAncestor', { commentId: originalAncestor });
                            },

                            removeChildren: ( originalAncestor: string ) => {
                                setState(prev => ({
                                    ...prev,
                                    videoData: {
                                        ...prev.videoData!,
                                        comments: (
                                            () => {
                                                let oldComment = prev.videoData?.comments!;
                    
                                                let index = oldComment?.findIndex(v => v.id === originalAncestor);
                    
                                                if( index !== -1 && index !== undefined) oldComment?.splice(
                                                    index,
                                                    1,
                                                    {
                                                        ...oldComment[index],
                                                        children: []
                                                    }
                                                )
                    
                                                return oldComment;
                                            }
                                        )()
                                    }
                                }))
                            },

                            videoData: {
                                likedVideo: false,
                                dislikedVideo: false,
                                ...res.data.WatchTrainerVideoV401
                            }
                        }
                    });


                }
            });
    }, [token, videoId]);

    useEffect(() => {
        if (state.loading !== true) return;

        socket.onVideo("LikedVideo", (newLike: { videoId: string }) => {

            setState(prev => {
                return {
                    ...prev,
                    videoData: {
                        ...prev.videoData!,
                        video: {
                            ...prev.videoData?.video!,
                            likes: (prev.videoData?.video.likes || 0) + 1
                        }
                    }
                }
            });

        });

        socket.onVideo("YouLikedVideo", (newLike: { videoId: string }) => {
            if (newLike.videoId === videoId) {
                setState(prev => {
                    return {
                        ...prev,
                        videoData: {
                            ...prev.videoData!,
                            likedVideo: true,
                            dislikedVideo: false
                        }
                    }
                })
            }
        });

        socket.onVideo("YouDisLikedVideo", (newDisLikes: { videoId: string }) => {
            if (newDisLikes.videoId === videoId) {
                setState(prev => {
                    return {
                        ...prev,
                        videoData: {
                            ...prev.videoData!,
                            likedVideo: false,
                            dislikedVideo: true,
                            video: {
                                ...prev.videoData?.video!,
                                likes: prev.videoData?.likedVideo === false ? prev.videoData?.video.likes : (prev.videoData?.video.likes || 0) - 1
                            }
                        }
                    }
                })
            }
        });

        socket.onVideo("newComment", (newComment: { id: string, comment: string, whoCreatedId: string, whoCreatedType: "lifters" | "trainers", whoCreatedName: string, whoCreatedProfilePicture: string, videoId: string }) => {
            setState(prev => {
                return {
                    ...prev,
                    videoData: {
                        ...prev.videoData!,
                        comments: prev.videoData?.comments.concat([
                            {
                                ...newComment,
                                updatedAt: new Date().getTime(),
                                childrenCount: 0,
                                children: []
                            }
                        ]) || []
                    }
                }
            })
        });
        
        socket.onVideo("newChildComment", ( newChildComment: { id: string, comment: string, whoCreatedId: string, whoCreatedType: "lifters" | "trainers", whoCreatedName: string, whoCreatedProfilePicture: string, videoId: string, parentId: string, ancestorId: string } ) => {
            setState(prev => ({
                ...prev,
                videoData: {
                    ...prev.videoData!,
                    commens: (
                        () => {
                            let oldComment = prev.videoData?.comments!;

                            let index = oldComment?.findIndex(v => v.id === newChildComment.ancestorId)

                            if ( index !== -1 && index !== undefined ) {
                                oldComment.splice(
                                    index,
                                    1,
                                    (
                                        () => {
                                            let children = oldComment[index].children?.length > 0 ? [ ...oldComment[index].children, newChildComment ] : [];
                                            let childrenCount = oldComment[index].childrenCount + 1;

                                            return {
                                                ...oldComment[index],
                                                children,
                                                childrenCount
                                            }
                                        }
                                    )()
                                );
                            }

                            return oldComment;
                        }
                    )()
                }
            }))
        });
        
        socket.onVideo("commentChildren", (commentChildren: { parent: string, children: WatchTrainerVideoV401CommentsChildren[] }) => {

            setState(prev => ({
                ...prev,
                videoData: {
                    ...prev.videoData!,
                    comments: (
                        () => {
                            let oldComment = prev.videoData?.comments!;

                            let index = oldComment?.findIndex(v => v.id === commentChildren.parent);

                            if( index !== -1 && index !== undefined) oldComment?.splice(
                                index,
                                1,
                                {
                                    ...oldComment[index],
                                    children: commentChildren.children
                                }
                            )

                            return oldComment;
                        }
                    )()
                }
            }))
        });

        socket.videoEmit("joinVideoRoom", { token, tokenType: "lifters", videoId });
    })

return state;
}
