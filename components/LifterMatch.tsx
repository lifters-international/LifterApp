import React from "react";
import { IconFill } from "@ant-design/icons-react-native";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { returnImageSource } from "../utils";
import { useAppDispatch } from "../redux";
import { acceptDeclineMatchThunk } from "../redux/features/auth"; 

export type LifterMatchProps = {
    id?: string;
    userToken?: string;
    username?: string;
    age?: number;
    bio?: string;
    profilePicture?: string;
    allowAction?: boolean;
    next?: () => void;
}

const LifterMatch: React.FC<LifterMatchProps> = ( { id, userToken, username, age, bio, profilePicture, allowAction, next } ) => {
    const dispatch = useAppDispatch();
    const shortenedBio = bio?.slice(0, 30) + ( (bio?.length!) >= 45 ? "..." : "" );

    const acceptMatch = async ( accept: boolean ) => {
        dispatch(acceptDeclineMatchThunk({
            token: userToken!, matchId: id!, accept
        }));
    }

    return (
        <View style={styles.container}>
            <View style={styles.lifterImageContainer}>
                <Image source={ returnImageSource(profilePicture as string) } style={styles.lifterImages}/>
                <BlurView intensity={0} tint="light" style={styles.liftersDetails}>
                    <Text style={{...styles.liftersDetailsText, ...styles.lifterDetailsName}}>{ username }, { age }</Text>
                    <TouchableOpacity onPress={() => Alert.alert(`${username}'s Bio`, bio)}>
                        <Text style={{...styles.liftersDetailsText, ...styles.lifterDetailsBio}}>{ shortenedBio }</Text>
                    </TouchableOpacity>
                </BlurView>
            </View>

            <View style={styles.lifterMatchActionContainer}>
                <TouchableOpacity style={{ ...styles.circle, ...styles.liftMatchX }} onPress={
                    allowAction ? () => {
                        acceptMatch(false); 
                        if (next) next()
                    }: undefined
                }>
                    <Text style={{color: "rgb(255, 155, 5)", textAlign: "center", fontSize: 20}}>X</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ ...styles.circle, ...styles.lifterMatchHeart }} onPress={
                    allowAction ? () => {
                        acceptMatch(true); 
                        if (next) next()
                    }: undefined
                }>
                    <IconFill name="heart" style={{color: "#fe005d", textAlign: "center", fontSize: 20}}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

LifterMatch.defaultProps = {
    userToken: "",
    id: "",
    username: "Codingwithcn",
    age: 18,
    bio: "Creator of this app, Software Developer, Enjoys Tech, Gaming, and Anime",
    profilePicture: "https://avatars.githubusercontent.com/u/43786652?v=4",
}

const styles = StyleSheet.create({
    container: {
        width: "70%",
        marginTop: "10%",
        marginLeft: "auto",
        marginRight: "auto"
    },

    lifterImageContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginLeft: "31.3%"
    },

    lifterImages: {
        marginLeft: 10,
        borderWidth: 2,
        borderColor: "gainsboro",
        borderRadius: 20,
        width: 270,
        height: 400
    },

    liftersDetails: {
        position: "relative",
        backgroundColor: "rgba(247, 112, 112, 0.562)",
        top: 175,
        left: -85,
        width: 270,
        height: 45,
        borderRadius: 0,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        textAlign: "left"
    },

    liftersDetailsText: {
        marginLeft: "10%",
        color: "white"
    },

    lifterDetailsName: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 1,
        marginLeft: 25,
    },

    lifterDetailsBio: {
        fontWeight: "bold",
        fontStyle: "italic",
        color: "rgb(138, 138, 138)",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap"
    },

    lifterMatchActionContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 20,
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%"
    },

    circle: {
        height: 45,
        width: 45,
        borderRadius: 50,
        padding: 10,
        textAlign: "center",
        marginLeft: 20,
        marginBottom: 10
    },

    liftMatchX: {
        backgroundColor: "hsl(35, 86%, 86%)",
        fontSize: 50,
        textAlign: "center"
    },

    lifterMatchHeart: {
        backgroundColor: "rgb(243, 210, 210)",
        alignItems: "center",
        justifyContent: "center"
    }
});

export default LifterMatch;