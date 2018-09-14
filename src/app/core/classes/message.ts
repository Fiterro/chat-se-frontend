import { MessageData } from "../types/message-data.type";
import { UserShort } from "../types/user-short.type";

export class Message {
    readonly id: number;
    readonly chatId: number;
    readonly sender: UserShort;
    readonly text: string;
    readonly viewCount: number;
    readonly sentAt: Date;

    constructor(data: MessageData) {
        this.id = data.id;
        this.chatId = data.chatId;
        this.text = data.text;
        this.sender = data.sender;
        this.viewCount = data.viewCount ? data.viewCount : 0;
        this.sentAt = new Date(data.sentAt);
    }
}
