import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { ChatsService } from "../../../services/chats.service";
import { Chat } from "../../../core/classes/chat";
import { Message } from "../../../core/classes/message";
import { PaginationParams } from "../../../core/classes/pagination-params";
import { map } from "rxjs/operators";

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
    private loadMore = true;
    private chatId: number;

    constructor(private readonly chatsService: ChatsService) {
    }

    ngOnInit(): void {
        this.activeChat
            .subscribe((chat) => {
                this.pagination = new PaginationParams();
                this.messageStorage.next([]);
                this.loadChatMessages(chat.id, true);
                this.loadMore = true;
                this.chatId = chat.id;
            });
    }

    get activeChat(): Observable<Chat> {
        return this.chatsService.activeChat;
    }

    get messages(): Observable<Message[]> {
        return this.messageStorage
            .pipe(
                map((messages) => messages.reverse())
            );
    }

    private loadChatMessages(chatId: number, firstTime = false): void {
        this.chatsService.getMessages(chatId, this.pagination)
            .subscribe(({data, pagination}) => {
                console.log("check");
                this.messageStorage.next([
                    ...data,
                    ...this.messageStorage.getValue()
                ]);
                if (firstTime) {
                    this.scrollToBottom();
                }
                this.pagination.next();

                if (this.messageStorage.getValue().length >= pagination.total) {
                    this.loadMore = false;
                }
            });
    }

    onScroll(target: HTMLElement): void {
        console.log("check onScroll")
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
