import React from "react";
import { IconFill } from "@ant-design/icons-react-native";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { returnImageSource, scale, verticalScale, moderateScale, GraphqlError } from "../utils";
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
    err?: ( error: GraphqlError[]) => void
}

const LifterMatch: React.FC<LifterMatchProps> = ( { id, userToken, username, age, bio, profilePicture, allowAction, next, err } ) => {
    const dispatch = useAppDispatch();
    const shortenedBio = bio?.slice(0, 30) + ( (bio?.length!) >= 45 ? "..." : "" );

    const acceptMatch = async ( accept: boolean ) => {
        dispatch(acceptDeclineMatchThunk({
            token: userToken!, matchId: id!, accept, err
        }));
    }

    return (
        <View style={styles.container}>
            <View style={styles.lifterImageContainer}>
                <Image source={ returnImageSource(profilePicture as string) } style={styles.lifterImages} resizeMode="stretch"/>
                
                <View style={styles.liftersDetails}>
                    <Text style={{...styles.liftersDetailsText, ...styles.lifterDetailsName}}>{ username }, { age }</Text>


                    <TouchableOpacity onPress={() => Alert.alert(`${username}'s Bio`, bio)} style={{ borderBottomWidth: 0.5, borderColor: "#363434" }}>
                        <Text style={{...styles.liftersDetailsText, ...styles.lifterDetailsBio, marginBottom: verticalScale(10) }}>{ shortenedBio }</Text>
                    </TouchableOpacity>

                    <View style={styles.lifterMatchActionContainer}>
                        <TouchableOpacity style={{ ...styles.circle, ...styles.liftMatchX }} onPress={
                            allowAction ? () => {
                                acceptMatch(false); 
                                if (next) next()
                            }: undefined
                        }>
                            <Text style={{color: "white", textAlign: "center", fontSize: moderateScale(20) }}>X</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ ...styles.circle, ...styles.lifterMatchHeart }} onPress={
                            allowAction ? () => {
                                acceptMatch(true); 
                                if (next) next()
                            }: undefined
                        }>
                            <IconFill name="heart" style={{color: "white", textAlign: "center", fontSize: moderateScale(20) }}/>
                        </TouchableOpacity>
                    </View>

                </View>
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
        marginTop: verticalScale(60),
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
        width: scale(270),
        height: verticalScale(300),
        position: "absolute",
        right: scale(-35),
        top: verticalScale(20)
    },

    liftersDetails: {
        position: "absolute",
        backgroundColor: "hsl(0, 1%, 13%)",
        top: verticalScale(312),
        left: scale(-35),
        width: scale(270),
        height: verticalScale(150),
    },

    liftersDetailsText: {
        textAlign: "center",
        color: "white"
    },

    lifterDetailsName: {
        fontSize: moderateScale(25),
        fontWeight: "bold",
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10)
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
        width: scale(100),
        padding: moderateScale(10),
        textAlign: "center",
        marginLeft: scale(10),
        marginBottom: verticalScale(10)
    },

    liftMatchX: {
        backgroundColor: "#363434",
        fontSize: moderateScale(50),
        textAlign: "center"
    },

    lifterMatchHeart: {
        backgroundColor: "#FF3636",
        alignItems: "center",
        justifyContent: "center"
    }
});

export default LifterMatch;