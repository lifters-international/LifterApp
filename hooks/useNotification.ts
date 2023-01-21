import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Subscription } from 'expo-modules-core';

import { fetchGraphQl, NotificationTokenType, NotificationPayloadCreationInput, getDiviceId, Notification, NotificationType } from "../utils";
import { createNotificationPayload } from "../graphQlQuieries";
import { useTabBarContext } from "../navigation/Tab";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});

export const useNotifications = ( userToken : string ) => {
    const { navigate } = useTabBarContext();
    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();

    useEffect(() => {
        let run = async () => {
            if ( userToken == null ) return;

            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                  name: 'default',
                  importance: Notifications.AndroidImportance.MAX,
                  vibrationPattern: [0, 250, 250, 250],
                  lightColor: '#FF231F7C',
                });
            }


            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync({
                    ios: {
                        allowAlert: true,
                        allowBadge: true,
                        allowSound: true,
                        allowAnnouncements: true,
                        allowDisplayInCarPlay: true
                    }
                });
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync({
                experienceId: '@codingwithcn/LiftersHome'
            })).data;

            const payload: NotificationPayloadCreationInput = {
                token,
                tokenType: Platform.OS === 'ios' ? 
                    NotificationTokenType.IOS : Platform.OS === "android" ? 
                    NotificationTokenType.ANDROID : NotificationTokenType.WEB,

                deviceID: getDiviceId()
            }

            let result = await fetchGraphQl(createNotificationPayload, { token: userToken, payload });

            if ( result.errors ) return;

            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                //console.log(notification);
            });
          
            // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                let { type, data } = response.notification.request.content.data as Notification;

                switch ( type ) {
                    case NotificationType.NEW_MATCH:
                        navigate("Home", { open: "Message" } )
                        break;
                    case NotificationType.NEW_MESSAGE:
                        navigate("Home", { open: "Message", command: "newMessageSent", ...data } )
                        break;
                    default:
                        break;
                }
            });
        }

        run();
    }, [userToken]);


    return {
        notificationListener,
        responseListener
    }

}
