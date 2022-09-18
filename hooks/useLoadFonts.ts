import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export const useloadFonts = (): boolean => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        (async () => {
        await Font.loadAsync({
            antoutline: require('@ant-design/icons-react-native/fonts/antoutline.ttf'),
            antfill: require('@ant-design/icons-react-native/fonts/antfill.ttf')
        });
        setLoaded(true);
        })();
    }, []);
    return loaded;
}