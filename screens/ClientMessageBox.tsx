import React from "react";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

import { AppLayout, Loading, TrainersClientSettings as Settings, TrainersTrain as Train, TrainsClientMessage as Message } from "../components";
import { scale, verticalScale, moderateScale } from "../utils";
import { useGetClientsTrainerAndMessages } from "../hooks";

type Props = {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

const ClientMessageBox: React.FC<Props> = ({ navigation, route }) => {
    const { token } = useSelector((state: any) => state.Auth);
    const { client, open } = route.params as { client: string, open: "messages" | "settings" | "train" };
    const clientAndMessages = useGetClientsTrainerAndMessages( token, client );

    if ( !client ) {
        return (
            <AppLayout backgroundColor="black">
                <View style={{ borderWidth: moderateScale(1), borderColor: "hsl(0, 0%, 22%)", borderRadius: moderateScale(5), position: "relative", top: verticalScale(40) }}>
                    <Text style={{ color: "hsl(0, 0%, 53%)", fontSize: moderateScale(20) }}>Click on a trainer to start talking to them</Text>
                </View>
            </AppLayout>
        )
    }

    if ( clientAndMessages.loading ) return <AppLayout backgroundColor="black"><Loading/></AppLayout>

    if ( clientAndMessages.error.length > 0 ) {
        return (
            <AppLayout backgroundColor="black">
                <View style={{ backgroundColor: "rgb(16, 16, 16)", width: scale(250), height: verticalScale(60), marginRight: "auto", marginLeft: "auto", borderRadius: moderateScale(10), position: "relative", top: verticalScale(250) }}>
                    <Text style={{ color: "white", textAlign: "center", fontSize: moderateScale(20), marginTop: moderateScale(15) }}>{clientAndMessages.error[0].message}</Text>
                </View>
            </AppLayout>
        )
    }

    return (
        <AppLayout backgroundColor="black">
            <View>
                {
                    open === "settings" ?
                        <Settings {...clientAndMessages.details} client={client} token={token} navigation={navigation} /> :
                        open === "train" ?
                        <Train /> :
                        open === "messages"?
                            <Message 
                                {...clientAndMessages.details} 
                                client={client} 
                                token={token}  
                                messages={clientAndMessages.messages} 
                                sendMessage={clientAndMessages.sendMessage}
                                sendReadMessage={clientAndMessages.sendReadMessage}
                                navigation={navigation}
                                route={route}
                            /> : null
                }
            </View>
        </AppLayout>
    )
}

export default ClientMessageBox
