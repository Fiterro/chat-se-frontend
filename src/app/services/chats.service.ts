import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, share, tap } from "rxjs/operators";

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

@Injectable()
export class ChatsService {
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

    sendMessage(text: string): Observable<any> {
        const chatId = this.activeChatId.getValue();
        const senderId = this.sessionService.userSnapshot.id;
        const dataToSend = {
            chatId,
            text,
            senderId
        };
        return this.httpClient
            .post<ResponseModel<any>>(`${this.API_ROOT}/messages`, dataToSend)
            .pipe(
                map(({data}) => data)
            );
    }

    getMessages(chatId?: number, params?: PaginationParams): Observable<{data: Message[], pagination: { total: number }}> {
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

    private retrieveChatList(): Observable<Chat[]> {
        return this.httpClient.get<ResponseModel<ChatData[]>>(this.API_ROOT)
            .pipe(
                map(({data}) => data.map((chat) => new Chat(chat)))
            );
    }
}
