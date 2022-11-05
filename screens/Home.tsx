import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LifterMatch, Loading, AppLayout, DailyMatchLimit } from "../components";
import { useSelector } from "react-redux";
import { useGetUserMatches, useNotifications } from '../hooks';
import { useAppDispatch } from "../redux";
import { setAuthState } from "../redux/features/auth";
import { saveToStore } from "../utils";

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const { token } = useSelector((state: any) => state.Auth);
    useNotifications(token);
    const [userMatches, setUserMatches] = useGetUserMatches(token);
    const [currentMatch, setCurrentMatch] = useState(0);
    const [dailyMatchLimit, setDailyMatchLimit] = useState(false);

    if (userMatches.error.length > 0) {
        if (userMatches.error[0].message === "User does not exist.") {
            (async () => {
                await saveToStore("token", "");
                await saveToStore("username", "");
                await saveToStore("password", "");
                dispatch(setAuthState({
                    token: "",
                    tokenVerified: false,
                    username: "",
                    password: ""
                }));
            })();
        }

        else if (
            userMatches.error[0].message === "You have reached your daily limit on matches." && dailyMatchLimit === false
        ) setDailyMatchLimit(true);
    }

    if (userMatches.loading) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

    if (dailyMatchLimit) {
        return (
            <AppLayout backgroundColor="black">
                <View style={styles.container}>
                    <DailyMatchLimit />
                </View>
            </AppLayout>
        )
    }

    return (
        <AppLayout backgroundColor="black">
            <View style={styles.container}>
                <View>
                    <LifterMatch
                        {...userMatches.users![currentMatch]}
                        allowAction
                        next={
                            () => {
                                if (currentMatch + 1 < userMatches.users!.length) setCurrentMatch(currentMatch + 1);

                                else {
                                    setUserMatches({ ...userMatches, refreshTimes: userMatches.refreshTimes + 1 });
                                    setCurrentMatch(0);
                                }
                            }
                        }
                        userToken={token}

                        err={
                            (error) => {
                                if (error[0].message === "You have reached your daily limit on matches.") setDailyMatchLimit(true);
                            }
                        }

                    />
                </View>
            </View>
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
    }
});

export default Home;
