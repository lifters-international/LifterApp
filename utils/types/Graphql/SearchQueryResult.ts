import { SubscriptionType } from "../stripe.types"
import { UserData } from "./UserData"

export type SearchQueryResult = {
    searchUsers: {
        userSubscription: SubscriptionType;
        results: UserData[];
    }
}