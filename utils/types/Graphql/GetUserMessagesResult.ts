import { Message } from "./Message";
import { MessageWhoSent } from "./Message";

export type GetUserMessagesResult = {
    getUserMessages: {
        whoIsUser: MessageWhoSent;
        messages: Message[];
    }
}