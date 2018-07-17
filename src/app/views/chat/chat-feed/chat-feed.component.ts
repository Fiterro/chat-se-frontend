import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { ChatsService } from "../../../services/chats.service";
import { Chat } from "../../../core/classes/chat";
import { Message } from "../../../core/classes/message";

@Component({
    selector: "app-chat-feed",
    templateUrl: "./chat-feed.component.html",
    styleUrls: ["./chat-feed.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatFeedComponent implements OnInit {
    private readonly messageStorage = new BehaviorSubject<Message[]>([]);

    constructor(private readonly chatsService: ChatsService) {
    }

    ngOnInit(): void {
        this.activeChat
            .subscribe((chat) => {
                this.loadChatMessages(chat.id);
            });
    }

    get activeChat(): Observable<Chat> {
        return this.chatsService.activeChat;
    }

    get messages(): Observable<Message[]> {
        return this.messageStorage.asObservable();
    }

    private loadChatMessages(chatId: number): void {
        this.chatsService.getMessages(chatId)
            .subscribe((messages) => {
                this.messageStorage.next(messages);
            });
    }
}
