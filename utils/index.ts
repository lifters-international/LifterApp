import * as SecureStore from 'expo-secure-store';
export * from "./types";
export * from "./fetchGraphQl";
export * from "./url";
//export * from "./client"
export { default as socket } from "./socket";
export * from "./getCurrentDate";

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