import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, ScrollView, Image } from 'react-native';
import { Loading, AppLayout, TrainersSearchCard, Button } from "../components";
import { useSearchQuery, useSignedInUserData } from '../hooks';
import { returnImageSource, scale, verticalScale, moderateScale } from "../utils";
import { useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons';
import { useTabBarContext } from '../navigation/Tab';

const Search: React.FC = () => {
    const { token } = useSelector((state: any) => state.Auth);
    const [search, setSearch] = useState('');
    const { loading, data } = useSignedInUserData(token);
    const queryResult = useSearchQuery(search, token);

    let showDiv = queryResult.result ? true : false;

    if (showDiv) showDiv = queryResult.result!.length > 0 ? true : false;

    const { navigate } = useTabBarContext();

    if ( loading ) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

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
                                                            <View style={{ borderWidth: moderateScale(1), borderColor: "#1d1d1d", borderRadius: moderateScale(10), padding: moderateScale(10), marginTop: moderateScale(10), marginBottom: moderateScale(10), width: scale(340), marginRight: "auto", marginLeft: "auto" }}>
                                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", borderBottomWidth: moderateScale(1), borderColor: "#1d1d1d"}}>
                                                                    <Image
                                                                        style={{ width: scale(100), height: verticalScale(50), borderRadius: moderateScale(20), marginBottom: moderateScale(10) }}
                                                                        source={returnImageSource(result.lifters!.profilePicture)}
                                                                        resizeMode="contain"
                                                                    />

                                                                    <View style={{ marginBottom: moderateScale(10) }}>
                                                                        <Text style={{ color: "rgb(56, 56, 56)", fontSize: moderateScale(35) }}>{result.lifters!.username}</Text>
                                                                    </View>
                                                                </View>

                                                                <View style={{ marginTop: moderateScale(10) }}>
                                                                    <Text style={{ color: "white", fontSize: moderateScale(18), textAlign: "center" }}>{result.lifters!.bio || "Default Lifters Bio"}</Text>
                                                                </View>

                                                                <Button
                                                                    title="VIEW LIFTER"
                                                                    onPress={() => navigate("Reels", { open: "LiftersPage", userIdParam: result.lifters!.id, userId: data?.id })}
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
                                                        ) : <TrainersSearchCard {...result.trianer!} />
                                                    }
                                                </View>
                                            )
                                        ))
                                    }

                                    <View style={{ height: verticalScale(455) }}></View>
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
