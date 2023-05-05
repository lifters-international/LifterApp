import React from "react";

import { View, Text, Image } from 'react-native';

import { Stars } from "./Stars";

import Button from "./Button";

import { TrainersSummary, returnImageSource, moderateScale, scale, verticalScale } from "../utils";

import { useTabBarContext } from "../navigation/Tab";

const TrainersCard: React.FC<TrainersSummary> = ({ id, name, bio, profilePicture, price, ratingsAverage }) => {
    const { navigate } = useTabBarContext();

    return (
        <View style={{ borderWidth: moderateScale(1), borderColor: "#1d1d1d", borderRadius: moderateScale(10), padding: moderateScale(10), marginTop: moderateScale(15), marginBottom: moderateScale(10), width: scale(340), marginRight: "auto", marginLeft: "auto" }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", borderBottomWidth: moderateScale(1), borderColor: "#1d1d1d"}}>
                <Image
                    style={{ width: scale(100), height: verticalScale(50), borderRadius: moderateScale(20), marginBottom: moderateScale(10) }}
                    source={returnImageSource(profilePicture)}
                    resizeMode="contain"
                />
                <View style={{ marginBottom: moderateScale(10) }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ color: "rgb(56, 56, 56)", fontSize: moderateScale(35) }}>{name}</Text>
                        <Text style={{ color: "rgb(6, 252, 6)", fontSize: moderateScale(35), marginLeft: moderateScale(10) }}>${price}</Text>
                    </View>
                    <Stars
                        value={ratingsAverage}
                        edit={false}
                    />
                </View>
            </View>

            <View style={{ marginTop: moderateScale(10) }}>
                <Text style={{ color: "white", fontSize: moderateScale(18), textAlign: "center" }}>{bio}</Text>
            </View>

            <Button
                title="VIEW TRAINER"
                onPress={() => navigate("Home", { open: "TrainerPage", trainerId: id })}
                style={{
                    alignItems: "center",
                    backgroundColor: "#FF3636",
                    borderRadius: moderateScale(10),
                    padding: moderateScale(10),
                    marginTop: moderateScale(10)
                }}
                textStyle={{ color: "white", fontSize: moderateScale(15) }}
            />
        </View>
    )
}

export default TrainersCard;
