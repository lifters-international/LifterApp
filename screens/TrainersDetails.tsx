import React, { useState } from "react";
import { View, Text, ScrollView, Image, Share, Alert, TouchableOpacity } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { Ionicons, MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';

import { Loading, AppLayout, TrainerDetailsHome, TrainersRatingSlide, TrainerWriteSlide, Stars } from "../components";

import { useGetTrainerDetails } from "../hooks";
import { scale, moderateScale, verticalScale, returnImageSource, shortenText, shortenNumber } from "../utils";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

const TrainerDetails: React.FC<Props> = ({ navigation, route }) => {
    const { token } = useSelector((state: any) => state.Auth);
    const { trainer, open } = route.params as { trainer: string, open: "home" | "rating" | "write" };

    const [show, setShow] = useState<"home" | "rating" | "write">(open || "home");

    const trainerDetails = useGetTrainerDetails({ id: trainer || "" });

    if (trainerDetails.loading) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

    if (trainerDetails.error) return (
        <AppLayout backgroundColor="black">
            <View style={{ backgroundColor: "rgb(16, 16, 16)", width: scale(340), height: verticalScale(55), marginRight: "auto", marginLeft: "auto", borderRadius: moderateScale(10), position: "relative", top: verticalScale(250) }}>
                <Text style={{ color: "white", textAlign: "center", fontSize: moderateScale(16), marginTop: moderateScale(15) }}>Problem finding trainer, please try again later.</Text>
            </View>
        </AppLayout>
    )

    return (
        <AppLayout backgroundColor="black">
            <View>
                <Image
                    source={returnImageSource(trainerDetails.data?.bannerImage!)}
                    resizeMode="stretch"
                    style={{
                        width: scale(350),
                        height: verticalScale(90)
                    }}
                />

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Image
                            source={returnImageSource(trainerDetails.data?.profilePicture!)}
                            resizeMode="stretch"
                            style={{
                                borderWidth: moderateScale(1),
                                borderColor: "rgb(59, 59, 59)",
                                borderRadius: moderateScale(30),
                                padding: moderateScale(10),
                                width: scale(45),
                                height: verticalScale(40),
                                marginRight: moderateScale(10)
                            }}
                        />

                        <View style={{ width: scale(180) }}>
                            <View style={{ display: "flex", flexDirection: "row" }}>
                                <Text style={{ color: "white", fontSize: moderateScale(16) }}>{trainerDetails.data?.name}</Text>
                                {
                                    trainerDetails.data?.onBoardCompleted ?
                                        <MaterialIcons color="#FF3636" name="verified-user" size={moderateScale(18)} /> : null
                                }
                            </View>

                            <Stars
                                value={trainerDetails.data?.ratingsAverage!}
                                edit={false}
                                size={15}
                            />

                            <TouchableOpacity onPress={() =>  Alert.alert(trainerDetails.data?.bio!) }>
                                <Text style={{ color: "rgb(59, 59, 59)", fontSize: moderateScale(15) }}>{shortenText(trainerDetails.data?.bio!, 60)}</Text>
                            </TouchableOpacity>
                            <Text style={{ color: "rgb(59, 59, 59)", fontSize: moderateScale(15) }}>{shortenNumber(trainerDetails.data?.clientCount!)} Clients</Text>
                        </View>
                    </View>

                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Ionicons
                            name="md-chatbubble-ellipses"
                            color="#FF3636"
                            size={moderateScale(35)}
                            onPress={() => navigation.navigate("BecomeClient", { trainer: trainer, redirectTab: "messages" })}
                        />

                        <Feather
                            size={moderateScale(35)}
                            color="#FF3636"
                            name="share"
                            onPress={async () => {
                                const result = await Share.share({
                                    message: `Come and check out ${trainerDetails.data?.name}'s trainers page on LiftersHome... The #1 Home For All Things GYM!!!`,
                                    url: `https://www.lifters.app/trainer/${trainerDetails.data?.id}`
                                })
                            }}
                        />

                        <MaterialIcons
                            color="#FF3636"
                            size={moderateScale(35)}
                            name="attach-money"
                            onPress={() => navigation.navigate("BecomeClient", { trainer: trainer, redirectTab: "settings" })}
                        />
                    </View>
                </View>
            </View>

            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: moderateScale(20), borderBottomWidth: moderateScale(1), borderBottomColor: "rgb(59, 59, 59)" }}>
                <View
                    style={{
                        marginBottom: moderateScale(15),
                        borderBottomColor: show == "home" ? "#FF3636" : "black",
                        borderBottomWidth: moderateScale(1)
                    }}
                >
                    <FontAwesome
                        name="home"
                        size={moderateScale(35)}
                        color="#FF3636"
                        style={{
                            marginBottom: moderateScale(15)
                        }}

                        onPress={() => setShow("home")}
                    />
                </View>

                <View
                    style={{
                        marginBottom: moderateScale(15),
                        borderBottomColor: show == "rating" ? "#FF3636" : "black",
                        borderBottomWidth: moderateScale(1)
                    }}
                >
                    <MaterialIcons
                        name="stars"
                        size={moderateScale(35)}
                        color="#FF3636"
                        style={{
                            marginBottom: moderateScale(15)
                        }}

                        onPress={() => setShow("rating")}
                    />
                </View>

                <View
                    style={{
                        marginBottom: moderateScale(15),
                        borderBottomColor: show == "write" ? "#FF3636" : "black",
                        borderBottomWidth: moderateScale(1)
                    }}
                >
                    <FontAwesome
                        name="pencil-square"
                        size={moderateScale(35)}
                        color="#FF3636"
                        style={{
                            marginBottom: moderateScale(15)
                        }}

                        onPress={() => setShow("write")}
                    />
                </View>
            </View>

            <KeyboardAwareScrollView style={{ height: "100%" }} extraScrollHeight={verticalScale(220)}>

                <ScrollView>
                    {show === "home" && <TrainerDetailsHome gyms={trainerDetails.data?.gyms!} trainerId={trainer} token={token} />}
                    {show === "rating" && <TrainersRatingSlide ratings={trainerDetails.data?.ratings!} />}
                    {show === "write" && <TrainerWriteSlide token={token} name={trainerDetails.data?.name!} trainerId={trainer} setRating={() => setShow("rating")} />}
                </ScrollView>

            </KeyboardAwareScrollView>
        </AppLayout>
    )

}

export default TrainerDetails;
