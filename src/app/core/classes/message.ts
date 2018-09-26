import * as moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { BehaviorSubject, Observable } from "rxjs";

import { MessageData } from "../types/message-data.type";
import { UserShort } from "../types/user-short.type";
import { MessageStatus } from "../enums/message-status.enum";

export class Message {
    readonly idNumber = new BehaviorSubject<number | undefined>(undefined);
    readonly chatId: number;
    readonly sender: UserShort;
    readonly text: string;
    readonly sentAt: Date;
    readonly uuid: string;
    readonly status = new BehaviorSubject<MessageStatus>(MessageStatus.Pending);
    readonly isNewMessage = new BehaviorSubject<boolean>(true);
    readonly viewCount = new BehaviorSubject<number | undefined>(undefined);

    constructor(data: MessageData) {
        if (data.id) {
            this.idNumber.next(data.id);
        }
        this.chatId = data.chatId;
        this.text = data.text;
        this.sender = data.sender;
        this.sentAt = data.sentAt ? new Date(data.sentAt) : new Date(moment().toISOString());
        this.uuid = data.uuid ? data.uuid : uuidv4();
        this.setViewCount(data.viewCount);
        this.setNew(data.isNew);
    }

    get isNew(): Observable<boolean> {
        return this.isNewMessage.asObservable();
    }

    get id(): number {
        return this.idNumber.getValue();
    }

    setNew(value: boolean): void {
        this.isNewMessage.next(value);
    }

    setViewCount(viewCount: number): void {
        this.viewCount.next(viewCount);
        if (viewCount > 0) {
            this.status.next(MessageStatus.Read);
        } else if (viewCount === 0) {
            this.status.next(MessageStatus.Sent);
        } else {
            this.status.next(MessageStatus.Pending);
        }
    }

    updateId(id: number) {
        this.idNumber.next(id);
    }
}
