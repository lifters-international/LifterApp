import React from "react";

import { Octicons } from '@expo/vector-icons';

import { TrainerVideoSummary, getDiff, shortenText, shortenNumber, returnImageSource, moderateScale, scale, verticalScale } from "../utils";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";

const VideoSummary: React.FC<{ profilePicture?: string, trainerName?: string, onClick?: () => void } & TrainerVideoSummary> = ({ thumbnail, trainerName, duration, clientOnly, isClient, title, views, updatedAt, profilePicture, onClick }) => {
    let durationSummary = new Date(duration * 1000).toISOString().substring(11, 19);

    durationSummary = durationSummary.substring(0, 3) === "00:" ? durationSummary.substring(3) : durationSummary;

    let date = new Date(new Date(updatedAt).toLocaleString());

    return (
        <View style={style.VideoSummary}>
            <TouchableOpacity onPress={onClick}>
                <View style={style.VidInfor}>
                    <Image source={returnImageSource(thumbnail as string)} style={style.thumbnail} resizeMode="stretch" />
                    <View style={style.durationView}>
                        <Text style={style.duration}>{durationSummary}</Text>
                    </View>
                </View>

                <View style={ profilePicture ? style.prof : undefined }>
                    {
                        profilePicture && <Image source={returnImageSource(profilePicture as string)} style={style.profilePicture} resizeMode="stretch" />
                    }

                    <View>
                        <Text style={{ color: "white" }}>{shortenText(title, 52)}</Text>
                        <Text style={{ color: "white" }}>
                            { shortenText(trainerName || "", 8) }&nbsp;
                            { trainerName && <>&#8226;</> }&nbsp;
                            {shortenNumber(views)} views &#8226; &nbsp;
                            {getDiff(date, new Date(new Date().toLocaleString()))} ago &nbsp;
                            {
                                clientOnly ?
                                    isClient ? null : <Octicons color="#FF3636" size={moderateScale(20)} title="client only" />
                                    :
                                    null
                            }
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    VideoSummary: {
        marginBottom: moderateScale(10),
        marginTop: verticalScale(20),
        marginLeft: scale(10)
    },

    VidInfor: {
        width: scale(50)
    },

    prof: {
        display: "flex",
        flexDirection: "row"
    },

    profilePicture: {
        borderWidth: moderateScale(1),
        borderColor: "#FF3636",
        borderRadius: moderateScale(50),
        width: scale(50),
        height: verticalScale(50),
        marginRight: moderateScale(12)
    },

    thumbnail: {
        width: scale(330),
        height: verticalScale(250),
        borderRadius: moderateScale(10)
    },

    durationView: {
        borderRadius: moderateScale(10),
        position: "relative",
        top: verticalScale(-30),
        left: scale(275),
        backgroundColor: "rgb(20, 20, 20)",
        padding: moderateScale(5)
    },

    duration: {
        color: "rgb(150, 150, 150)",
        textAlign: "center"
    }
})

export default VideoSummary;
