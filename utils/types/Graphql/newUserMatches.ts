import { SubscriptionType } from "../stripe.types";

export type newUserMatches = {
    id: string;
    profilePicture: string;
    name: string;
    date: Date;
}

export type newUserSubscriptionMatches = {
    userSubscription: SubscriptionType;

    matches: newUserMatches[];
}