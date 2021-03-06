import { ChatData } from "../types/chat-data.type";

export class Chat {
    readonly id: number;
    readonly name: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(data: ChatData) {
        this.id = data.id;
        this.name = data.name;
        this.createdAt = new Date(data.created_at);
        this.updatedAt = new Date(data.updated_at);
    }
}
