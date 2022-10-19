import React from "react";
import { IconFill } from "@ant-design/icons-react-native";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { returnImageSource, scale, verticalScale, moderateScale } from "../utils";
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
                <Image source={ returnImageSource(profilePicture as string) } style={styles.lifterImages} resizeMode="contain"/>
                <View style={styles.liftersDetails}>
                    <Text style={{...styles.liftersDetailsText, ...styles.lifterDetailsName}}>{ username }, { age }</Text>
                    <TouchableOpacity onPress={() => Alert.alert(`${username}'s Bio`, bio)}>
                        <Text style={{...styles.liftersDetailsText, ...styles.lifterDetailsBio}}>{ shortenedBio }</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.lifterMatchActionContainer}>
                <TouchableOpacity style={{ ...styles.circle, ...styles.liftMatchX }} onPress={
                    allowAction ? () => {
                        acceptMatch(false); 
                        if (next) next()
                    }: undefined
                }>
                    <Text style={{color: "rgb(255, 155, 5)", textAlign: "center", fontSize: moderateScale(20) }}>X</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ ...styles.circle, ...styles.lifterMatchHeart }} onPress={
                    allowAction ? () => {
                        acceptMatch(true); 
                        if (next) next()
                    }: undefined
                }>
                    <IconFill name="heart" style={{color: "#fe005d", textAlign: "center", fontSize: moderateScale(20) }}/>
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
        width: scale(200),
        height: verticalScale(500),
        marginTop: verticalScale(70),
        marginLeft: "auto",
        marginRight: "auto"
    },

    lifterImageContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },

    lifterImages: {
        borderWidth: moderateScale(2),
        borderColor: "gainsboro",
        borderRadius: moderateScale(20),
        width: scale(270),
        height: verticalScale(420),
        position: "absolute",
        right: scale(-35),
        top: verticalScale(20)
    },

    liftersDetails: {
        position: "absolute",
        backgroundColor: "#f99f9f",
        top: verticalScale(395),
        left: scale(-35),
        width: scale(270),
        height: verticalScale(45),
        borderRadius: 0,
        borderBottomRightRadius: moderateScale(20),
        borderBottomLeftRadius: moderateScale(20),
        textAlign: "left"
    },

    liftersDetailsText: {
        marginLeft: "10%",
        color: "white"
    },

    lifterDetailsName: {
        fontSize: moderateScale(20),
        fontWeight: "bold",
        marginTop: verticalScale(1),
        marginLeft: scale(25),
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
        marginTop: verticalScale(20),
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        position: "absolute",
        bottom: 0,
    },

    circle: {
        height: verticalScale(45),
        width: scale(45),
        borderRadius: moderateScale(50),
        padding: moderateScale(10),
        textAlign: "center",
        marginLeft: scale(20),
        marginBottom: verticalScale(10)
    },

    liftMatchX: {
        backgroundColor: "hsl(35, 86%, 86%)",
        fontSize: moderateScale(50),
        textAlign: "center"
    },

    lifterMatchHeart: {
        backgroundColor: "rgb(243, 210, 210)",
        alignItems: "center",
        justifyContent: "center"
    }
});

export default LifterMatch;