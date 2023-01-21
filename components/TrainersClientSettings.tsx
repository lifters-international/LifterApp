import React, { useState } from "react";

import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import { CheckBox } from 'react-native-elements';

import { NavigationProp, Link } from "@react-navigation/native";

import { Ionicons, AntDesign } from "@expo/vector-icons";

import { TrainersDecision, fetchGraphQl, getDiff, UpdateTrainerClient, returnImageSource, moderateScale, verticalScale, scale } from "../utils";

import { createTrainerClient, cancelCreateTrainersRequest, updateTrainerClientSettings } from "../graphQlQuieries";

import Button from "./Button";

type SettingsProps = {
    name: string;
    profilePicture: string;
    trainersDecision: TrainersDecision;
    dateCreated: number;
    client: string;
    token: string;
    canSeeUserFoodHistory: boolean;
    navigation: NavigationProp<any>;
    trainer: string;
}

export const TrainersClientSettings: React.FC<SettingsProps> = ({ trainer, name, profilePicture, trainersDecision, dateCreated, client, token, canSeeUserFoodHistory, navigation }) => {
    const [acceptClientLoading, setAcceptClientLoading] = useState(false);

    const [settingsDropDown, setSettingsDropDown] = useState(false);

    const [updateSettings, setUpdateSettings] = useState<UpdateTrainerClient>({ canSeeUserFoodHistory });

    const [savingLoading, setSavingLoading] = useState(false);

    const [reloadHack, setReloadHack] = useState(1);

    const acceptClient = async (accept: boolean) => {
        if (acceptClientLoading) return;

        setAcceptClientLoading(true);

        fetchGraphQl(accept ? createTrainerClient : cancelCreateTrainersRequest, { token, trainerId: client })
            .then(() => {
                setAcceptClientLoading(false);
                setReloadHack(reloadHack + 1)
            })
    }

    return (
        <View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>

                <TouchableOpacity onPress={() => navigation.navigate("TrainerPage", { trainer })} style={{ display: "flex", flexDirection: "row" }}>
                    <Image source={returnImageSource(profilePicture)} resizeMode="contain" />
                    <Text style={{ color: "white", fontSize: moderateScale(20), position: "relative", top: verticalScale(10) }}>{name}</Text>
                </TouchableOpacity>

                <Link
                    to={{ screen: "ClientMessageBox", params: { client, open: "messages" } }}
                >
                    <Ionicons name="md-send" size={moderateScale(40)} color="#FF3636" />
                </Link>

            </View>

            <View style={{ borderTopWidth: moderateScale(1), borderColor: "hsl(0, 0%, 22%)", marginTop: moderateScale(10) }}>
                {
                    trainersDecision === TrainersDecision.VERIFYING_PAYMENT || trainersDecision === TrainersDecision.PENDING || trainersDecision === TrainersDecision.DENIED ?
                        (
                            <View>
                                <Text style={{ color: "rgb(165, 164, 164)", textAlign: "center", fontStyle: "italic", fontSize: moderateScale(20), marginTop: moderateScale(15) }}>
                                    {`${trainersDecision === TrainersDecision.DENIED ? "Re-" : ""}`}
                                    Apply to be {name}'s client
                                </Text>

                                <View>
                                    <Text style={{ color: "rgb(54, 54, 54)", textAlign: "center", fontSize: moderateScale(20), marginTop: moderateScale(55) }}>Benefits</Text>

                                    <View style={{ borderTopWidth: moderateScale(1), borderTopColor: "rgb(87, 87, 87)" }}>
                                        <Text style={styles.benefit}>Messaging</Text>
                                        <Text style={styles.benefit}>Booking Sessions</Text>
                                        <Text style={styles.benefit}>Access to client only videos</Text>
                                    </View>
                                </View>

                                <Button
                                    style={{ position: "relative", width: scale(300), marginRight: "auto", marginLeft: "auto", backgroundColor: "#FF3636", borderRadius: moderateScale(10), padding: moderateScale(10) }}
                                    textStyle={{ color: "white", textAlign: "center", fontSize: moderateScale(20) }}
                                    title={
                                        acceptClientLoading ?
                                            "Loading..." :
                                            trainersDecision === TrainersDecision.VERIFYING_PAYMENT ?
                                                "Verifying Payment. We will notify you once verified" : `${trainersDecision === TrainersDecision.DENIED ? "Re-" : ""}Apply`
                                    }
                                    onPress={() => acceptClient(true)}
                                />
                            </View>
                        )
                        :
                        (
                            <View>
                                <Text style={{ color: "rgb(80, 80, 80)", fontSize: moderateScale(20), textAlign: "center", marginTop: moderateScale(10) }}>Client Since: {getDiff(new Date(new Date(dateCreated).toLocaleString()), new Date(new Date().toLocaleString()))} ago </Text>

                                <View>
                                    <TouchableOpacity style={{ display: "flex", flexDirection: "row", marginTop: moderateScale(15) }} onPress={() => setSettingsDropDown(!settingsDropDown)} >
                                        <Text style={{ color: "rgb(54, 54, 54)", textAlign: "center", fontSize: moderateScale(20) }}>Trainers Settings</Text>
                                        <AntDesign size={moderateScale(30)} name={!settingsDropDown ? "arrowdown" : "arrowup"} color="#FF3636" onPress={() => setSettingsDropDown(!settingsDropDown)} />
                                    </TouchableOpacity>

                                    {
                                        !settingsDropDown && (
                                            <View>
                                                <Button
                                                    style={{ position: "relative", top: verticalScale(-40), left: scale(130), width: scale(80), marginRight: "auto", marginLeft: "auto", backgroundColor: "#FF3636", borderRadius: moderateScale(10), padding: moderateScale(10) }}
                                                    textStyle={{ color: "white", textAlign: "center", fontSize: moderateScale(12) }}
                                                    title={`${savingLoading ? "Saving..." : "Save"}`}
                                                    onPress={() => {
                                                        setSavingLoading(true);
                                                        fetchGraphQl(updateTrainerClientSettings, { token, clientId: client, infor: updateSettings })
                                                            .then((res) => setSavingLoading(false));
                                                    }}
                                                />

                                                <View
                                                    style={{ borderWidth: moderateScale(1), borderColor: "rgb(54, 54, 54)", borderRadius: moderateScale(10), padding: moderateScale(10), backgroundColor: "rgb(12, 12, 12)", marginBottom: moderateScale(10), marginTop: moderateScale(10) }}
                                                >
                                                    <Text
                                                        style={{ color: "rgb(54, 54, 54)", textAlign: "center", fontSize: moderateScale(12), fontStyle: "italic" }}
                                                    >
                                                        Activating this will allow Trainer to see your daily food history
                                                    </Text>
                                                </View>

                                                <CheckBox
                                                    title="Can Trainer See Your Daily Food History"
                                                    checked={updateSettings?.canSeeUserFoodHistory}
                                                    onPress={() => setUpdateSettings(prev => ({ ...prev, canSeeUserFoodHistory: !prev.canSeeUserFoodHistory }))}
                                                />
                                            </View>
                                        )
                                    }
                                </View>

                                <Button
                                    style={{ position: "relative", width: scale(300), marginRight: "auto", marginLeft: "auto", backgroundColor: "#FF3636", borderRadius: moderateScale(10), padding: moderateScale(10) }}
                                    textStyle={{ color: "white", textAlign: "center", fontSize: moderateScale(20) }}
                                    title={
                                        acceptClientLoading ?
                                            "Loading..." : `Cancel Subscription`
                                    }
                                    onPress={
                                        () => acceptClient(false)
                                    }
                                />
                            </View>
                        )
                }
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    benefit: {
        borderWidth: moderateScale(1),
        borderColor: "rgb(87, 86, 86)",
        width: "90%",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        marginRight: "auto",
        marginLeft: "auto",
        textAlign: "center",
        fontSize: moderateScale(20),
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10),
        color: "rgb(83, 83, 83)"
    }
})
