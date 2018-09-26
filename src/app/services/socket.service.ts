import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import * as io from "socket.io-client";

import { SOCKET_URL } from "../../environments/environment";
import { SocketEvents } from "../core/enums/socket-events.enum";
import { MessageData } from "../core/types/message-data.type";
import { MessageReadData } from "../core/types/message-read.type";

@Injectable({
    providedIn: "root"
})
export class SocketService {
    readonly newMessage = new Subject<MessageData>();
    readonly messagesRead = new Subject<MessageReadData[]>();
    private socket: SocketIOClient.Socket;

    connect() {
        if (this.socket) {
            this.disconnect();
        }

        this.socket = io(SOCKET_URL, {});

        this.initEventListeners();
    }

    emitEvent(type: SocketEvents, data: any): void {
        this.socket.emit(type, data);
    }

    private disconnect(): void {
        this.socket.close();
    }

    private initEventListeners(): void {
        this.socket
            .on(SocketEvents.Message, (data: MessageData) => {
                this.newMessage.next(data);
            });

        this.socket
            .on(SocketEvents.MessagesRead, (data: MessageReadData[]) => {
                this.messagesRead.next(data);
            });
    }
}
