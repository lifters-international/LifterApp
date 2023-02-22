import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Loading, AppLayout, TrainersSearchCard } from "../components";
import { useSearchQuery, useAcceptDeclineMatch } from '../hooks';
import { returnImageSource, scale, verticalScale, moderateScale } from "../utils";
import { useSelector } from "react-redux";
import { IconFill } from "@ant-design/icons-react-native";
import { Ionicons } from '@expo/vector-icons';

const Search: React.FC = () => {
    const { token } = useSelector((state: any) => state.Auth);
    const [search, setSearch] = useState('');
    const queryResult = useSearchQuery(search, token);
    const acceptDeclineMatch = useAcceptDeclineMatch();

    const acceptMatch = async (accept: boolean, id: string) => {
        await acceptDeclineMatch.acceptDecline(token, id, accept);
    }

    let showDiv = queryResult.result ? true : false;

    if (showDiv) showDiv = queryResult.result!.length > 0 ? true : false;

    return (
        <AppLayout backgroundColor="black">
            <View style={styles.Header}>
                <Text style={styles.HeaderText}>SEARCH FOR LIFTERS</Text>
                <Image
                    source={require("../assets/images/hero-section-line-vector.png")}
                    style={styles.line}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.SearchBar}>
                <Ionicons
                    name="search"
                    size={moderateScale(30)}
                    color="#5e5c5c"
                    style={{
                        width: scale(30),
                        height: verticalScale(30),
                        textDecorationColor: "black",
                        position: "relative",
                        top: moderateScale(2),
                    }}
                />
                <TextInput placeholder="Search Lifters" style={styles.SearchInput} value={search} onChangeText={query => setSearch(query)} />
            </View>

            {
                queryResult.loading ? <Loading /> :
                    showDiv ?
                        (
                            <View style={styles.SearchResultView}>
                                <ScrollView style={styles.LifterMatches}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {
                                        queryResult.result?.map((result, index) => (
                                            (
                                                <View key={`user-search-result-${index}`}>
                                                    {
                                                        result.type === "lifters" ? (
                                                            <View style={styles.SearchResult}>
                                                                <Image
                                                                    style={styles.SearchResultImage}
                                                                    source={returnImageSource(result.lifters?.profilePicture!)}
                                                                    resizeMode="contain"
                                                                />
                                                                <TouchableOpacity onPress={ () => alert(`Username: ${result.lifters?.username}`) } >
                                                                    <Text style={styles.name}>{result.lifters?.username.slice(0, 5) + ( result.lifters!.username.length > 5 ? "..." : "" )}</Text>
                                                                </TouchableOpacity>
                                                                <View style={{ display: "flex", flexDirection: "row", alignSelf: "stretch", position: "relative", left: scale(120) }}>
                                                                    <TouchableOpacity style={styles.liftMatchX} onPress={() => acceptMatch(false, result.lifters?.id!)}>
                                                                        <Text style={{ color: "white", textAlign: "center", fontSize: moderateScale(25) }}>X</Text>
                                                                    </TouchableOpacity>

                                                                    <TouchableOpacity style={styles.lifterMatchHeart} onPress={() => acceptMatch(true, result.lifters?.id!)}>
                                                                        <IconFill name="heart" style={{ color: "white", textAlign: "center", fontSize: moderateScale(25) }} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        ): <TrainersSearchCard {...result.trianer!}/>
                                                    }
                                                </View>
                                            )
                                        ))
                                    }
                                </ScrollView>
                            </View>
                        ) :
                        (
                            <View style={styles.NoLifters}>
                                <Text style={styles.NoLiftersText}>No Lifters Found</Text>
                            </View>
                        )
            }
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    Header: {
        padding: moderateScale(10)
    },

    HeaderText: {
        fontSize: moderateScale(25),
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        position: "relative",
        top: moderateScale(20)
    },

    line: {
        height: verticalScale(100),
        width: scale(400),
        zIndex: 1
    },

    SearchBar: {
        marginTop: verticalScale(5),
        width: "100%",
        display: "flex",
        flexDirection: "row",
        padding: moderateScale(2),
        borderBottomWidth: moderateScale(2),
        borderColor: "hsl(0, 1%, 22%)",
        borderRadius: moderateScale(10),
        position: "relative",
        bottom: moderateScale(80)
    },

    SearchInput: {
        width: "100%",
        borderWidth: moderateScale(2),
        borderColor: "black",
        borderRadius: moderateScale(5),
        padding: moderateScale(5),
        fontSize: moderateScale(20),
        color: "#afadad"
    },

    SearchResultView: {
        position: "relative",
        bottom: moderateScale(50),
    },

    LifterMatches: {
        backgroundColor: "black",
        padding: moderateScale(10),
        height: "100%"
    },

    SearchResult: {
        borderTopWidth: moderateScale(1),
        borderBottomWidth: moderateScale(1),
        borderColor: "#5e5c5c",
        backgroundColor: "black",
        padding: moderateScale(20),
        display: "flex",
        flexDirection: "row",
        width: scale(345)
    },

    SearchResultImage: {
        width: scale(50),
        height: verticalScale(50),
        padding: moderateScale(5)
    },

    name: {
        fontSize: moderateScale(20),
        fontWeight: "bold",
        marginTop: "2.5%",
        marginLeft: "2.5%",
        color: "#5e5c5c"
    },

    liftMatchX: {
        marginTop: "2%",
        height: verticalScale(25),
        width: scale(50),
        position: "absolute",
        right: scale(10),
    },

    lifterMatchHeart: {
        position: "absolute",
        top: verticalScale(6),
        height: verticalScale(25),
        width: scale(50),
        marginLeft: "1.5%"
    },

    NoLifters: {
        borderWidth: moderateScale(2),
        borderColor: "#5e5c5c",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        marginTop: "35%",
        width: "70%",
        marginLeft: "auto",
        marginRight: "auto"
    },

    NoLiftersText: {
        fontSize: moderateScale(30),
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },

    SubscriptionView: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 104, 104, 0.548)",
    },

    SubscriptionText: {
        position: "relative",
        top: "25%",
        left: "10%",
        width: scale(280),
        backgroundColor: "white",
        padding: moderateScale(10),
        borderRadius: moderateScale(10)
    }
})

export default Search;
