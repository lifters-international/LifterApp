import React, { useState, useEffect, useRef } from "react";

import { fetchGraphQl, WatchTrainerVideo, socket } from "../utils";

import { watchTrainerVideo } from "../graphQlQuieries";

export type WatchTrainerVideoState = {
    loading: boolean;
    error: string;
    videoData?: {
        likedVideo: boolean;
        dislikedVideo: boolean;
    } & WatchTrainerVideo;

    likeVideo: () => void,
    disLikeVideo: () => void;
    postComment: (comment: string) => void;
    updateTime: ( time : number ) => void;
}

export const useWatchTrainerVideo = (token: string, videoId: string) => {
    const ran = useRef({
        oldVideo: "",
        ran: 0
    });
    let running = false;

    const [state, setState] = useState<WatchTrainerVideoState>({
        loading: true,
        error: "",
        likeVideo: () => { },
        disLikeVideo: () => { },
        postComment: (comment: string) => { },
        updateTime: ( time : number ) => {}
    });

    useEffect(() => {
        if (token === null || videoId === null || ( ran.current.ran === 1 && ran.current.oldVideo === videoId ) || running) return;

        ran.current.oldVideo = videoId;

        fetchGraphQl(watchTrainerVideo, { token, videoId })
            .then(res => {
                ran.current.ran++;

                if (res.errors) {
                    setState(prev => {
                        return {
                            ...prev,
                            error: res.errors[0].message,
                            loading: false,
                            videoData: undefined
                        }
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

                            postComment: (comment: string) => {
                                socket.videoEmit("postComment", { token, tokenType: "lifters", videoId, comment })
                            },

                            updateTime: ( time: number ) => {
                                socket.videoEmit("updateVideoTime", { token, tokenType: "lifters", time, videoId, viewHistoryId: res.data.WatchTrainerVideo.viewHistoryId! })
                            },

                            videoData: {
                                likedVideo: false,
                                dislikedVideo: false,
                                ...res.data.WatchTrainerVideo
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
            console.log("newComment", newComment)
            setState(prev => {
                return {
                    ...prev,
                    videoData: {
                        ...prev.videoData!,
                        comments: prev.videoData?.comments.concat([
                            {
                                ...newComment,
                                updatedAt: new Date().getTime()
                            }
                        ]) || []
                    }
                }
            })
        });

        socket.videoEmit("joinVideoRoom", { token, tokenType: "lifters", videoId });
    })

    return state;
}
