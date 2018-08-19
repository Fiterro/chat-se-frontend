import { Injectable } from "@angular/core";

import * as io from "socket.io-client";

import { SOCKET_URL } from "../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class SocketService {
    private socket: SocketIOClient.Socket;

    connect() {
        this.socket = io(SOCKET_URL, {});

        this.socket.on("message", (data) => {
            console.log(data);
        });
    }

    disconnect(): void {
        this.socket.close();
    }

    emitEvent(type: string, data: any): void {
        this.socket.emit(type, data);
    }
}
