import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Logo, LifterMatch, Loading, AppLayout } from "../components";
import { useSelector } from "react-redux";
import { useGetUserMatches } from '../hooks';
import { useAppDispatch } from "../redux";
import { setAuthState } from "../redux/features/auth";
import { saveToStore } from "../utils";

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const { token } = useSelector((state: any) => state.Auth);
    const [userMatches, setUserMatches] = useGetUserMatches(token);
    const [currentMatch, setCurrentMatch] = useState(0);

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
    }

    if (userMatches.loading) return <AppLayout><Loading /></AppLayout>;

    return (
        <AppLayout>
            <View style={styles.container}>
                <View>
                    <LifterMatch {...userMatches.users![currentMatch]} allowAction next={
                        () => {
                            if (currentMatch + 1 < userMatches.users!.length) setCurrentMatch(currentMatch + 1);

                            else {
                                setUserMatches({ ...userMatches, refreshTimes: userMatches.refreshTimes + 1 });
                                setCurrentMatch(0);
                            }
                        }
                    } userToken={token} />
                </View>
            </View>
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
    }
});

export default Home;