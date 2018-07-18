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

@Injectable()
export class ChatsService {
    private readonly API_ROOT = API_ROOT_CHAT;
    private chatsList = new BehaviorSubject<Chat[] | undefined>(undefined);
    private activeChatId = new BehaviorSubject<number | undefined>(undefined);

    constructor(private readonly httpClient: HttpClient,
                private readonly sessionSerivce: SessionService) {
    }

    get chats(): Observable<Chat[]> {
        if (!this.chatsList.getValue()) {
            return this.retrieveChatList()
                .pipe(
                    map((chats) => {
                        this.chatsList.next(chats);
                        return chats;
                    }),
                    tap((chats) => this.activeChatId.next(chats[0].id)),
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

    sendMessage(text: string): Observable<any> {
        const chatId = this.activeChatId.getValue();
        const senderId = this.sessionSerivce.userSnapshot.id;
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

    getMessages(chatId?: number): Observable<Message[]> {
        const id = chatId ? chatId : this.activeChatId.getValue();
        return this.httpClient
            .get<ResponseModel<MessageData[]>>(`${this.API_ROOT}/${id}/messages`)
            .pipe(
                map(({data}) => data.map((message) => new Message(message)))
            );
    }

    private retrieveChatList(): Observable<Chat[]> {
        return this.httpClient.get<ResponseModel<ChatData[]>>(this.API_ROOT)
            .pipe(
                map(({data}) => data.map((chat) => new Chat(chat)))
            );
    }
}
