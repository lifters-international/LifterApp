import { UserData } from "./UserData"; 

export type UserSubscriptionInfor = {
    stripeSubscriptionId: string;
} & UserData;

export type UserSubscriptionInforResult = {
    getUserSubscriptionInfor: UserSubscriptionInfor
}