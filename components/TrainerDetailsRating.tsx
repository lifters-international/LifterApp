import React from "react";
import { View, Image, Text } from "react-native";

import { Stars } from "./Stars";

import { TrainersRatings, getDiff, returnImageSource, verticalScale, moderateScale, scale } from "../utils";

export const TrainersRatingSlide: React.FC<{ ratings: TrainersRatings[] }> = ({ ratings }) => {
    return (
        <View style={{ marginBottom: verticalScale(50) }}>
            {
                ratings.map((rating, index) => (
                    <View key={index + rating.id + "rating"} style={{ backgroundColor: "rgb(12, 12, 12)", borderRadius: moderateScale(10), padding: moderateScale(10), width: scale(325), marginRight: "auto", marginLeft: "auto", marginBottom: moderateScale(20), marginTop: moderateScale(20) }}>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <Image source={returnImageSource(rating.lifterProfilePicture)} resizeMode="stretch" style={{ borderRadius: moderateScale(20) }} />

                            <View>
                                <Text style={{ color: "rgb(255, 255, 255)", fontSize: moderateScale(20) }}>{rating.lifterName}</Text>
                                <Text style={{ color: "rgb(255, 255, 255)", fontSize: moderateScale(12) }}>{getDiff(new Date(new Date(rating.createdAt).toLocaleString()), new Date(new Date().toLocaleString()))} ago</Text>
                            </View>
                        </View>

                        <Stars
                            edit={false}
                            value={rating.rating}
                        />

                        <Text style={{ color: "rgb(255, 255, 255)", fontSize: moderateScale(18), marginTop: moderateScale(20) }}>{rating.comment}</Text>
                    </View>
                ))
            }
        </View>
    )
}
