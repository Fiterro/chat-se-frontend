import { MessageReadData } from "../types/message-read.type";

export class MessageRead {
    readonly messageId: number;
    readonly userId: number;
    readonly countViews?: number;

    constructor(data: MessageReadData) {
        this.messageId = data.messageId;
        this.userId = data.userId;
        this.countViews = data.countViews;
    }
}
