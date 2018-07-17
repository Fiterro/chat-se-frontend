import { MessageData } from "../types/message-data.type";

export class Message {
    readonly id: number;
    readonly chatId: number;
    readonly senderId: number;
    readonly text: string;
    readonly status: number;
    readonly viewCount: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(data: MessageData) {
        this.id = data.id;
        this.chatId = data.chatId;
        this.senderId = data.senderId;
        this.text = data.text;
        this.status = data.status;
        this.viewCount = data.viewCount ? data.viewCount : 0;
        this.createdAt = new Date(data.created_at);
        this.updatedAt = new Date(data.updated_at);
    }
}
