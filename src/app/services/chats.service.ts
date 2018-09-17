import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { filter, map, share, tap } from "rxjs/operators";

import { v4 as uuidv4 } from "uuid";

import { API_ROOT_CHAT } from "../app.constants";
import { ResponseModel } from "../core/types/response-model.type";
import { Chat } from "../core/classes/chat";
import { ChatData } from "../core/types/chat-data.type";
import { Message } from "../core/classes/message";
import { MessageData } from "../core/types/message-data.type";
import { SessionService } from "./session.service";
import { PaginationParams } from "../core/classes/pagination-params";
import { ResponseListModel } from "../core/types/response-list-model.type";
import { SocketService } from "./socket.service";
import { TimelineItem } from "../core/classes/timeline-item.class";
import { SocketEvents } from "../core/enums/socket-events.enum";
import { MessageToSend } from "../core/types/message-to-send.type";

@Injectable()
export class ChatsService {
    readonly messageSent = new Subject<Message>();

    private readonly API_ROOT = API_ROOT_CHAT;
    private chatsList = new BehaviorSubject<Chat[] | undefined>(undefined);
    private activeChatId = new BehaviorSubject<number | undefined>(undefined);

    constructor(private readonly httpClient: HttpClient,
                private readonly sessionService: SessionService,
                private readonly socketService: SocketService) {
        socketService.connect();
    }

    get chats(): Observable<Chat[]> {
        if (!this.chatsList.getValue()) {
            return this.retrieveChatList()
                .pipe(
                    map((chats) => {
                        this.chatsList.next(chats);
                        return chats;
                    }),
                    tap((chats) => chats[0] && this.activeChatId.next(chats[0].id)),
                    share()
                );
        }
        return this.chatsList.asObservable();
    }

    get activeChat(): Observable<Chat> {
        return this.activeChatId
            .pipe(
                filter((chatId) => !!chatId),
                map((chatId) =>
                    this.chatsList.getValue()
                        .find((chat) => chat.id === chatId)
                ),
                share()
            );
    }

    get newMessage(): Observable<Message> {
        return this.socketService.newMessage
            .pipe(
                map((messageData: MessageData) => {
                    return new Message(messageData);
                })
            );
    }

    selectChat(chatId: number): void {
        if (chatId && chatId !== this.activeChatId.getValue()) {
            this.activeChatId.next(chatId);
        }
    }

    createChat(name: string): Observable<Chat> {
        return this.httpClient.post<ResponseModel<Chat>>(`${this.API_ROOT}`, {name})
            .pipe(
                map(({data}) => data),
                tap((chat: Chat) => this.chatsList.next([...this.chatsList.getValue(), chat]))
            );
    }

    sendMessage(text: string): void {
        const chatId = this.activeChatId.getValue();
        const senderId = this.sessionService.userSnapshot.profile.id;
        // Prepare data to send through sockets
        const dataToSend: MessageToSend = {
            chatId,
            text,
            senderId,
            uuid: uuidv4()
        };
        // Create message and store in feed
        const message = new Message({
            chatId,
            text,
            sender: this.sessionService.userSnapshot.profile,
            uuid: dataToSend.uuid
        });
        this.messageSent.next(message);

        return this.socketService
            .emitEvent(SocketEvents.CreateMessage, dataToSend);
    }

    getMessages(chatId?: number, params?: PaginationParams): Observable<{ data: Message[], pagination: { total: number } }> {
        const id = chatId ? chatId : this.activeChatId.getValue();
        const paramsToSend = params ? params.toHttpParams() : new PaginationParams().toHttpParams();
        return this.httpClient
            .get<ResponseListModel<MessageData>>(`${this.API_ROOT}/${id}/messages`, {params: paramsToSend})
            .pipe(
                map((response) => {
                    return {
                        data: response.data.map((message) => new Message(message)),
                        pagination: response.pagination
                    };
                })
            );
    }

    getChatActivity(chatId?: number): Observable<TimelineItem[]> {
        const id = chatId ? chatId : this.activeChatId.getValue();
        return this.httpClient
            .get<ResponseModel<any>>(`${this.API_ROOT}/${id}/activity`)
            .pipe(
                map(({data}) => data.map((item) => new TimelineItem(item)))
            );
    }

    private retrieveChatList(): Observable<Chat[]> {
        return this.httpClient.get<ResponseModel<ChatData[]>>(this.API_ROOT)
            .pipe(
                map(({data}) => data.map((chat) => new Chat(chat)))
            );
    }
}
