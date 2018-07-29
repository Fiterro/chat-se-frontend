import { MessageData } from "../types/message-data.type";
import { UserShort } from "../types/user-short.type";

export class Message {
    readonly id: number;
    readonly chatId: number;
    readonly senderId: number;
    readonly sender: UserShort;
    readonly text: string;
    readonly status: number;
    readonly viewCount: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(data: MessageData) {
        this.id = data.id;
        this.chatId = data.chatId;
        this.senderId = data.senderId;
        this.sender = data.sender;
        this.text = data.text;
        this.status = data.status;
        this.viewCount = data.viewCount ? data.viewCount : 0;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
    }
}
