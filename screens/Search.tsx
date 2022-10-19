import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Loading, AppLayout } from "../components";
import { useSearchQuery, useAcceptDeclineMatch } from '../hooks';
import { returnImageSource, SubscriptionType, scale, verticalScale, moderateScale } from "../utils";
import { useSelector } from "react-redux";
import { IconFill } from "@ant-design/icons-react-native";

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
        <AppLayout>
            <View style={styles.Header}>
                <Text style={styles.HeaderText}>Search For Lifters</Text>
            </View>
            <View style={styles.SearchBar}>
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
                                        queryResult.result?.map((lifter, index) => (
                                                (
                                                    <View key={`user-search-result-${index}`} style={styles.SearchResult}>
                                                        <Image
                                                            style={styles.SearchResultImage}
                                                            source={returnImageSource(lifter.profilePicture)}
                                                            resizeMode="contain"
                                                        />
                                                        <Text style={styles.name}>{lifter.username}</Text>
                                                        <TouchableOpacity style={styles.liftMatchX} onPress={() => acceptMatch(false, lifter.id)}>
                                                            <Text style={{ color: "rgb(255, 155, 5)", textAlign: "center", fontSize: moderateScale(20) }}>X</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity style={styles.lifterMatchHeart} onPress={() => acceptMatch(true, lifter.id)}>
                                                            <IconFill name="heart" style={{ color: "#fe005d", textAlign: "center", fontSize: moderateScale(20) }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            )
                                        )
                                    }
                                </ScrollView>
                                {
                                    queryResult.userSubscription === SubscriptionType.BASIC ? (
                                        <View style={styles.SubscriptionView}>
                                            <View style={styles.SubscriptionText}>
                                                <Text style={{ textAlign: "center", fontSize: moderateScale(20) }}>Upgrade to Pro. To See Lifters</Text>
                                            </View>
                                        </View>
                                    ) : null
                                }
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
        borderBottomWidth: moderateScale(2),
        borderColor: "gainsboro",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
    },

    HeaderText: {
        fontSize: moderateScale(30),
        fontWeight: "bold",
        color: "black",
        textAlign: "center",
    },

    SearchBar: {
        marginTop: verticalScale(5),
        width: "100%",
        display: "flex",
        flexDirection: "row",
        borderRadius: moderateScale(5),
        padding: moderateScale(2)
    },

    SearchInput: {
        width: "100%",
        borderWidth: moderateScale(2),
        borderColor: "black",
        borderRadius: moderateScale(5),
        padding: moderateScale(5),
        color: "black"
    },

    SearchResultView: {

    },

    LifterMatches: {
        backgroundColor: "#f5f5f5",
        borderWidth: moderateScale(1),
        borderColor: "#e5e5e5",
        borderRadius: moderateScale(4),
        padding: moderateScale(10),
        height: "100%"
    },

    SearchResult: {
        borderWidth: moderateScale(1),
        borderColor: "gainsboro",
        backgroundColor: "white",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        display: "flex",
        flexDirection: "row",
        gap: "1%",
        marginBottom: moderateScale(10)
    },

    SearchResultImage: {
        width: scale(50),
        height: verticalScale(50),
        padding: moderateScale(5),
        borderRadius: moderateScale(30),
        borderWidth: moderateScale(1),
        borderColor: "red"
    },

    name: {
        fontSize: moderateScale(20),
        fontWeight: "bold",
        marginTop: "2.5%",
        marginLeft: "2.5%"
    },

    liftMatchX: {
        marginTop: "2%",
        height: verticalScale(25),
        width: scale(50),
        borderRadius: moderateScale(50),
        borderWidth: moderateScale(1),
        borderColor: "rgb(255, 155, 5)",
        marginLeft: "1.5%"
    },

    lifterMatchHeart: {
        marginTop: "2%",
        height: verticalScale(25),
        width: scale(50),
        borderRadius: moderateScale(50),
        borderWidth: moderateScale(1),
        borderColor: "red",
        marginLeft: "1.5%"
    },

    NoLifters: {
        borderWidth: moderateScale(2),
        borderColor: "gainsboro",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        marginTop: "50%",
        width: "70%",
        marginLeft: "auto",
        marginRight: "auto"
    },

    NoLiftersText: {
        fontSize: moderateScale(30),
        fontWeight: "bold",
        color: "black",
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