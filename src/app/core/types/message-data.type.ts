import { UserShort } from "./user-short.type";

export type MessageData = Readonly<{
    chatId: number,
    text: string,
    sender: UserShort,
    id?: number,
    viewCount?: number,
    uuid?: string,
    sentAt?: string
}>;
