import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { ChatsService } from "../../../services/chats.service";
import { Chat } from "../../../core/classes/chat";
import { Message } from "../../../core/classes/message";
import { PaginationParams } from "../../../core/classes/pagination-params";

@Component({
    selector: "app-chat-feed",
    templateUrl: "./chat-feed.component.html",
    styleUrls: ["./chat-feed.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatFeedComponent implements OnInit {
    @ViewChild("feed") chatFeed: ElementRef;
    private readonly messageStorage = new BehaviorSubject<Message[]>([]);
    private pagination: PaginationParams;
    private loadMore = false;
    private chatId: number;

    constructor(private readonly chatsService: ChatsService) {
    }

    ngOnInit(): void {
        this.activeChat
            .subscribe((chat) => {
                this.pagination = new PaginationParams();
                this.messageStorage.next([]);
                this.loadChatMessages(chat.id, true);
                this.chatId = chat.id;
            });
    }

    get activeChat(): Observable<Chat> {
        return this.chatsService.activeChat;
    }

    get messages(): Observable<Message[]> {
        return this.messageStorage.asObservable();
    }

    private loadChatMessages(chatId: number, firstTime = false): void {
        this.chatsService.getMessages(chatId, this.pagination)
            .subscribe(({data, pagination}) => {
                this.messageStorage.next([
                    ...data.reverse(),
                    ...this.messageStorage.getValue()
                ]);
                if (firstTime) {
                    this.scrollToBottom();
                }
                this.pagination.next();

                if (this.messageStorage.getValue().length < pagination.total) {
                    this.loadMore = true;
                }
            });
    }

    onScroll(target: HTMLElement): void {
        if (target.scrollTop === 0 && this.loadMore) {
            this.loadChatMessages(this.chatId);
        }
    }

    scrollToBottom(): void {
        window.requestAnimationFrame(() => {
            this.chatFeed.nativeElement.scrollTop = this.chatFeed.nativeElement.scrollHeight;
        });
    }
}
