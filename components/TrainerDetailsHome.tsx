import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import { moderateScale, scale, TrainersGym, verticalScale } from "../utils";

import { useUserGetAllTrainerVideo } from "../hooks";
import Loading from "./Loading";
import * as WebBrowser from 'expo-web-browser';
import VideoSummary from "./VideoSummary";

export type Props = {
    gyms: TrainersGym[];
    trainerId: string;
    token: string;
}

export const TrainerDetailsHome: React.FC<Props> = ({ gyms, trainerId, token }) => {
    let trainersVidSummary = useUserGetAllTrainerVideo(token, trainerId);

    if (trainersVidSummary.loading) return <Loading />;

    if (trainersVidSummary.error) {
        return (
            <View style={{ backgroundColor: "rgb(16, 16, 16)", width: scale(250), height: verticalScale(60), marginRight: "auto", marginLeft: "auto", borderRadius: moderateScale(10), position: "relative", top: verticalScale(250) }}>
                <Text style={{ color: "white", textAlign: "center", fontSize: moderateScale(20), marginTop: moderateScale(15) }}>An Error occured while loading trainer videos.</Text>
            </View>
        )
    }

    return (
        <View style={{ marginBottom: verticalScale(150) }}>
            <Text style={{ fontSize: moderateScale(20), color: "#5e5c5c", marginTop: moderateScale(20), marginBottom: moderateScale(20), textAlign: "center" }}>Trainer Gyms</Text>

            <ScrollView horizontal={true}>
                {
                    gyms.map((gym, index) => (
                        <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(`https://www.google.com/maps/search/?api=1&query=${gym.location}`)} key={index}
                            style={{
                                width: scale(300),
                                height: verticalScale(50),
                                borderWidth: moderateScale(1),
                                borderColor: "rgb(44, 44, 44)",
                                borderRadius: moderateScale(10),
                                padding: moderateScale(10),
                                marginLeft: scale(20),
                            }}
                        >
                            <Text style={{ color: "rgb(150, 150, 150)", textAlign: "center" }} >{gym.location}</Text>
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>

            <Text style={{ fontSize: moderateScale(20), color: "#5e5c5c", marginTop: moderateScale(20), marginBottom: moderateScale(20), textAlign: "center" }} >Trainer Videos</Text>

            <View style={{ marginBottom: verticalScale(250) }}>
                {
                    trainersVidSummary.data.map((vid, index) => (
                        <VideoSummary {...vid} key={index} />
                    ))
                }
            </View>
        </View>
    )
}
