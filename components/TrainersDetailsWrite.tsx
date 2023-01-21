import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";

import Button from "./Button";

import Loading from "./Loading";

import { Stars } from "./Stars";

import { createTrainerRating } from "../graphQlQuieries";

import { fetchGraphQl, moderateScale, scale } from "../utils";

type Prop = {
    token: string;
    name: string;
    trainerId: string;
    setRating: () => void;
}

export const TrainerWriteSlide: React.FC<Prop> = ({ token, name, trainerId, setRating }) => {
    const [ state, setState ] = useState<{ rating: number, comment: string }>({ rating: 5, comment: '' });
    const [ loading, setLoading ] = useState(false);

    const [ editing, setEditing ] = useState(false);

    if (loading) return <Loading />;

    return (
        <View style={{ backgroundColor: "rgb(12, 12, 12)", borderRadius: moderateScale(10), padding: moderateScale(20), width: scale(330), marginTop: moderateScale( editing ? -120 : 20), marginLeft: "auto", marginRight: "auto" }}>

            <Text style={{ color: "#5e5c5c", fontSize: moderateScale(20), marginBottom: moderateScale(20), textAlign: "center" }}>Write A Review for {name}</Text>

            <View>
                <Stars
                    edit={true}
                    value={0}
                    onPress={(val) => setState(prev => ({ ...prev, rating: val }))}
                />

                <TextInput
                    value={state.comment}
                    keyboardType="default"
                    onChangeText={(text) => setState(prev => ({ ...prev, comment: text }))}
                    placeholderTextColor="white"
                    style={{
                        width: scale(300),
                        borderWidth: moderateScale(2),
                        borderColor: "#222121",
                        borderRadius: moderateScale(10),
                        padding: moderateScale(10),
                        marginTop: moderateScale(15),
                        marginBottom: moderateScale(15),
                        fontSize: moderateScale(15),
                        color: "white"
                    }}

                    onEndEditing={ () => setEditing(false) }
                    onFocus={ () => setEditing(true) }
                />
            </View>

            <Button
                title="Submit Review"
                onPress={() => {
                    setLoading(true);
                    fetchGraphQl(createTrainerRating, { ...state, trainerId, token })
                        .then(req => {
                            setLoading(false);

                            if (req.errors) Alert.alert("Problem Submitting Review")
                            else {
                                setRating()
                            }
                        })
                }}
                style={{
                    backgroundColor: "#FF3636",
                    borderRadius: moderateScale(10),
                    padding: moderateScale(10),
                    marginBottom: moderateScale(10)
                }}

                textStyle={{
                    color: "white",
                    textAlign: "center"
                }}
            />
        </View>
    )
}
