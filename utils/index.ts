import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
export * from "@lifters-international/lifters-utils";
import { GraphqlFetchResult } from '@lifters-international/lifters-utils';
import { Dimensions } from 'react-native';

/*
export const fetchGraphQl = async ( query: string, variables: any ): Promise<GraphqlFetchResult> => {
    const response = await fetch(
        "https://server.lifters.app/graphql",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                variables,
            })
        }
    );

    const data = await response.json();

    return data;
} 

export const getApiUrl = () => {
    return `${getServerUrl()}graphql`;
}

export const getWSApiUrl = () => {
    return  "server.lifters.app";
}

export const getImageUploadApi = () => {
    return `${getServerUrl()}upload/image`;
}

export const getServerUrl = () => {
    return "https://server.lifters.app/";
}*/

export const saveToStore =  async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
}

export const getFromStore = async (key: string) => {
    return await SecureStore.getItemAsync(key);
}

export const removeFromStore = async (key: string) => {
    await SecureStore.deleteItemAsync(key);
}

export const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const formatAMPM = (date: Date) => {
    var hours = date.getHours();
    var minutes: string | number = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

export const capitalizeFirstLetter = (sent: string) => {
    return sent.charAt(0).toUpperCase() + sent.slice(1);
}

export const returnImageSource = ( source : string, soureOp?: { [key : string] : string | number } ) => {
    if (source === '/defaultPicture.png' || source === '../assets/defaultPicture.png') {
        return require('../assets/defaultPicture.png');
    } else {
        return { uri: source, ...soureOp };
    }
} 

const { width, height } = Dimensions.get('window');
//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const scale = ( size : number ) => width / guidelineBaseWidth * size;
export const verticalScale = ( size : number ) => height / guidelineBaseHeight * size;
export const moderateScale = ( size : number, factor = 0.5) => size + ( scale(size) - size ) * factor;
export const deviceWidth = width;
export const deviceHeight = height;

export const getDiviceId = () => `${Device.deviceName} ${Device.modelName!}`.replace(/ /g, "-");
