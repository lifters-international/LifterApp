export enum UserMessageStatus {
    DELIVERED = "DELIVERED",
    READ = "READ"
}

export enum MessageMetaDataType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
} 

export enum MessageWhoSent {
    USER = "USER",
    MATCHES = "MATCHES",
}

export type Message = {
    id: string;

    status: UserMessageStatus;

    whoSent: MessageWhoSent;

    metaDataType: MessageMetaDataType;

    message: string;

    createdAt: Date;

    timeRead?: Date;
}