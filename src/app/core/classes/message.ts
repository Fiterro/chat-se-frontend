import * as moment from "moment";
import { v4 as uuidv4 } from "uuid";

import { MessageData } from "../types/message-data.type";
import { UserShort } from "../types/user-short.type";
import { MessageStatus } from "../enums/message-status.enum";
import { BehaviorSubject } from "rxjs";

export class Message {
    readonly id: number;
    readonly chatId: number;
    readonly sender: UserShort;
    readonly text: string;
    readonly sentAt: Date;
    readonly uuid: string;
    readonly status = new BehaviorSubject<MessageStatus>(MessageStatus.Pending);
    viewCount: number;

    constructor(data: MessageData) {
        if (data.id) {
            this.id = data.id;
        }
        this.chatId = data.chatId;
        this.text = data.text;
        this.sender = data.sender;
        this.viewCount = data.viewCount;
        this.sentAt = data.sentAt ? new Date(data.sentAt) : new Date(moment().toISOString());
        this.uuid = data.uuid ? data.uuid : uuidv4();
        this.setStatus(data.viewCount);
    }

    setStatus(viewCount: number): void {
        this.viewCount = viewCount;
        if (viewCount > 0) {
            this.status.next(MessageStatus.Read);
        } else if (viewCount === 0) {
            this.status.next(MessageStatus.Sent);
        } else {
            this.status.next(MessageStatus.Pending);
        }
    }
}
