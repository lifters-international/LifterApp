import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Loading, AppLayout } from "../components";
import { useSearchQuery, useAcceptDeclineMatch } from '../hooks';
import { returnImageSource, SubscriptionType } from "../utils";
import { useSelector } from "react-redux";
import { IconFill } from "@ant-design/icons-react-native";
import { BlurView } from 'expo-blur';

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
                                                            <Text style={{ color: "rgb(255, 155, 5)", textAlign: "center", fontSize: 20 }}>X</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity style={styles.lifterMatchHeart} onPress={() => acceptMatch(true, lifter.id)}>
                                                            <IconFill name="heart" style={{ color: "#fe005d", textAlign: "center", fontSize: 20 }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            )
                                        )
                                    }
                                </ScrollView>
                                {
                                    queryResult.userSubscription === SubscriptionType.BASIC ? (
                                        <BlurView tint="light" style={styles.SubscriptionView}>
                                            <View style={styles.SubscriptionText}>
                                                <Text>Upgrade to Pro. To See Lifters</Text>
                                            </View>
                                        </BlurView>
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
        borderBottomWidth: 2,
        borderColor: "gainsboro",
        borderRadius: 10,
        padding: 10,
    },

    HeaderText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "black",
        textAlign: "center",
    },

    SearchBar: {
        marginTop: 5,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        borderRadius: 5,
        padding: 2
    },

    SearchInput: {
        width: "100%",
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 5,
        padding: 5,
        color: "black"
    },

    SearchResultView: {

    },

    LifterMatches: {
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#e5e5e5",
        borderRadius: 4,
        padding: 10,
        height: "100%"
    },

    SearchResult: {
        borderWidth: 1,
        borderColor: "gainsboro",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        display: "flex",
        flexDirection: "row",
        gap: "1%",
        marginBottom: 10
    },

    SearchResultImage: {
        width: 50,
        height: 50,
        padding: 5,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "red"
    },

    name: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: "2.5%",
        marginLeft: "2.5%"
    },

    liftMatchX: {
        marginTop: "2%",
        height: 25,
        width: 50,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "rgb(255, 155, 5)",
        marginLeft: "1.5%"
    },

    lifterMatchHeart: {
        marginTop: "2%",
        height: 25,
        width: 50,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "red",
        marginLeft: "1.5%"
    },

    NoLifters: {
        borderWidth: 2,
        borderColor: "gainsboro",
        borderRadius: 10,
        padding: 10,
        marginTop: "50%",
        width: "70%",
        marginLeft: "auto",
        marginRight: "auto"
    },

    NoLiftersText: {
        fontSize: 30,
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
        position: "absolute",
        top: "25%",
        left: "22%",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10
    }
})

export default Search;