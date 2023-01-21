import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";

import { NavigationProp, RouteProp } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { usePendingTrainers, useAcceptedTrainers } from "../hooks";

import { AppLayout, Loading, AcceptedTrainersView } from "../components";

import { moderateScale, scale, socket, verticalScale, returnImageSource } from "../utils";

type Prop = {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

const UserTrainers: React.FC<Prop> = ({ navigation, route }) => {
    const { token } = useSelector((state: any) => state.Auth);

    const [socketAuthenticated, setSocketAuthenticated] = useState(false);
    const pendingClients = usePendingTrainers(token);
    const acceptedClients = useAcceptedTrainers(token);

    socket.onTrainerClient("authenticated", () => {
        setSocketAuthenticated(true);
    });

    if (!socketAuthenticated) socket.trainerClientEmit("authenticate", { token: token, tokenType: "lifters" });

    if (!socketAuthenticated || pendingClients.loading || acceptedClients.loading) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

    return (
        <AppLayout backgroundColor="black">
            <View style={{ borderRadius: moderateScale(5), width: scale(350) }}>
                <View style={{ display: "flex", flexDirection: "row", marginTop: moderateScale(10) }}>
                    <Text style={{ color: "red", fontSize: moderateScale(15), }}>PENDING TRAINERS ACCEPTANCE</Text>
                    <Text
                        style={{
                            color: "#FF3636", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: moderateScale(20), padding: moderateScale(10),
                            position: "relative", bottom: verticalScale(12), left: 0, width: scale(40), height: verticalScale(35)
                        }}
                    >{pendingClients.data?.length}</Text>
                </View>

                <ScrollView horizontal={true}>
                    {
                        pendingClients.data?.map((client, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{ marginLeft: moderateScale(10) }}
                                onPress={
                                    () => navigation.setParams({ open: "settings", client: client.id })
                                }
                            >
                                <Image 
                                    style={{ padding: moderateScale(10), borderWidth: moderateScale(1), borderColor: "red", borderRadius: moderateScale(30), height: verticalScale(70), width: scale(70) }} 
                                    source={returnImageSource(client.profilePicture)} 
                                    resizeMode="contain" 
                                />
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View>

            <AcceptedTrainersView
                clients={acceptedClients.data}
                navigation={navigation}
                route={route}
            />
        </AppLayout>
    )
}

export default UserTrainers;
