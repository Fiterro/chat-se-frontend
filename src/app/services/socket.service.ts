import { Injectable } from "@angular/core";

import * as io from "socket.io-client";

import { SOCKET_URL } from "../../environments/environment";
import { SocketEvents } from "../core/enums/socket-events.enum";
import { Subject } from "rxjs";
import { MessageData } from "../core/types/message-data.type";

@Injectable({
    providedIn: "root"
})
export class SocketService {
    readonly newMessage = new Subject<MessageData>();
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
    }
}
