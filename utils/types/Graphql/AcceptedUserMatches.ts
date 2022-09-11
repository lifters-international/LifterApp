import { Message } from './Message';
import { newUserMatches } from "./newUserMatches";

export type AcceptedUserMatches = {
    lastMessage: Message | null;
    lastMessageDate: Date | null;
    unreadMessages: number;
} & newUserMatches;