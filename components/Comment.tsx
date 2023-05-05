import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import { getDiff, shortenNumber, WatchTrainerVideoV401Comments, returnImageSource, moderateScale, scale, verticalScale } from '../utils';
import Button from "./Button";

type Props = { 
    allowComments: boolean; 
    profilePicture: string; 
    askForChildren?: ( originalAncestor: string ) => void; 
    removeChildren?: ( originalAncestor: string ) => void;
    postComment: ( text: string, parentId?: string ) => void;
} & WatchTrainerVideoV401Comments;

export const WatchTrainerVideoComment: React.FC<Props> = ({ id, comment, updatedAt, allowComments, profilePicture, removeChildren, askForChildren, children, childrenCount, whoCreatedName, whoCreatedProfilePicture, parentId, postComment }) => {
    let date = new Date(new Date(updatedAt).toLocaleString());

    const [replying, setReplying] = useState(false);

    const [text, setText] = useState("");

    const [ childOpen, setChildOpen ] = useState(false);

    const toggle = () => {
        if (replying) {
            setText("");
        }

        setReplying(!replying);
    }

    const toggelChildren = () => {
        if ( childOpen ) {
            removeChildren!(id);
        }else {
            askForChildren!(id)
        }

        setChildOpen(!childOpen);
    }

    return (
        <View  style={{ display: "flex", flexDirection: "row", marginBottom: moderateScale(10), marginTop: moderateScale(10) }}>
            <Image source={returnImageSource(whoCreatedProfilePicture)} style={{ marginRight: moderateScale(4), borderRadius: moderateScale(50), width: scale(30), height: verticalScale(30) }} resizeMode="stretch" />

            <View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ color: "rgb(95, 93, 93)" }}>{whoCreatedName}</Text>
                    <Text style={{ color: "rgb(71, 71, 71)" }}>&nbsp; {getDiff(date, new Date(new Date().toLocaleString()))} ago </Text>
                </View>

                <View>
                    <Text style={{ color: "rgb(71, 71, 71)" }}>{comment}</Text>

                    <View>
                        <View style={{ display: "flex", flexDirection: "row", marginTop: moderateScale(10) }}>

                            {
                                childrenCount > 0 && (
                                    <TouchableOpacity onPress={toggelChildren} style={{ backgroundColor: "hsl(0, 0%, 7%)", borderRadius: moderateScale(10), padding: moderateScale(10), marginRight: moderateScale(10) }}>
                                        <Text style={{ color: "rgb(71, 71, 71)" }} >{shortenNumber(childrenCount)} replies</Text>
                                    </TouchableOpacity>
                                )
                            }

                            {
                                !replying && (
                                    <TouchableOpacity onPress={toggle} style={{ backgroundColor: "hsl(0, 0%, 7%)", borderRadius: moderateScale(10), padding: moderateScale(10), marginRight: moderateScale(10) }}>
                                        <Text style={{ color: "rgb(71, 71, 71)" }}>Reply</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>

                        <View>
                            {
                                (replying && allowComments) && (
                                    (
                                        <View style={{ marginTop: moderateScale(10) }}>
                                            <View style={{ display: "flex", flexDirection: "row" }}>
                                                <Image source={returnImageSource(profilePicture!)} style={{ marginRight: moderateScale(4), borderRadius: moderateScale(50), width: scale(30), height: verticalScale(30) }} resizeMode="stretch" />
                                                <TextInput
                                                    placeholder="Add a comment"
                                                    style={{ color: "rgb(100, 99, 99)" }}
                                                    value={text}
                                                    onChangeText={
                                                        (text) => {
                                                            setText(text)
                                                        }
                                                    }
                                                />
                                            </View>

                                            <View style={{ display: "flex", flexDirection: "row", marginTop: moderateScale(10), position: "relative", left: scale(120) }}>
                                                <Button 
                                                    title='Cancel'
                                                    style={{ backgroundColor: "rgb(29, 29, 29)", borderRadius: moderateScale(10), padding: moderateScale(10) }}
                                                    textStyle={{ color: "rgb(143, 143, 143)", fontSize: moderateScale(15) }}
                                                    onPress={toggle}
                                                />

                                                <Button 
                                                    title='Comment'
                                                    style={{ backgroundColor: "#FF3636", borderRadius: moderateScale(10), padding: moderateScale(10), marginLeft: moderateScale(10) }}
                                                    textStyle={{ color: "white", fontSize: moderateScale(15) }}
                                                    onPress={() => {
                                                        if (text.length > 0) {
                                                            postComment(text, parentId || id );
                                                            toggle()
                                                        }
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    )
                                )
                            }
                        </View>

                        <View>
                            {
                                children?.map( (child, index) => ( <WatchTrainerVideoComment {...child} allowComments={allowComments} profilePicture={profilePicture} childrenCount={0} children={[]} postComment={postComment} key={`com-child${index}`}/> ))
                            }
                        </View>

                    </View>
                </View>
            </View>
        </View>
    )
}
