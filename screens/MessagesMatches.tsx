import React from 'react';
import { View } from 'react-native';
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { AppLayout, Loading, LifterMatch } from "../components";
import { useSelector } from "react-redux";

import { useGetUserMatchDetails } from '../hooks';

interface Props {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

const MessagesMatches : React.FC<Props> = ({ navigation, route }) => {
   const { token } = useSelector((state: any) => state.Auth);

    const { matchId } = route.params!;

    const matchedDetails = useGetUserMatchDetails(token, matchId);

    if (matchedDetails.error.length > 0 ) {
        // Custom 404 page
        return <AppLayout><View></View></AppLayout>
    }

    if (matchedDetails.loading) return <Loading />

    return (
        <AppLayout>
            <View>
                <LifterMatch 
                    {...matchedDetails.user!}
                    allowAction
                    next={() => navigation.navigate("Messages")}
                    userToken={token}
                />
            </View>
        </AppLayout>
    )
}

export default MessagesMatches;