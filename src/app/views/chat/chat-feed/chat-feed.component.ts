import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, merge, share, startWith, switchMap, tap, throttleTime } from "rxjs/operators";

import { ChatsService } from "../../../services/chats.service";
import { Chat } from "../../../core/classes/chat";
import { Message } from "../../../core/classes/message";
import { PaginationParams } from "../../../core/classes/pagination-params";
import { BorderScrolledDirective } from "../../../shared/border-scrolled/border-scrolled.directive";

@Component({
    selector: "app-chat-feed",
    templateUrl: "./chat-feed.component.html",
    styleUrls: ["./chat-feed.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatFeedComponent implements OnInit {
    messages: Observable<Message[]>;
    @ViewChild("feed")
    private readonly chatFeed: ElementRef;
    @ViewChild(BorderScrolledDirective)
    private readonly borderScrolled: BorderScrolledDirective;
    private readonly chatHistory = new BehaviorSubject<Message[]>([]);
    private innerMessages: Message[] = [];
    private pagination: PaginationParams;
    private loadMore = false;
    private inProgress = false;
    private chatId: number;
    private firstTimeLoad = true;

    constructor(private readonly chatsService: ChatsService) {
    }

    private get activeChat(): Observable<Chat> {
        return this.chatsService.activeChat;
    }

    private get newMessage(): Observable<Message[]> {
        return this.chatsService.newMessage
            .pipe(
                filter((message) => message.chatId === this.chatId),
                tap(() => this.scrollToBottom()),
                map((message) => [message]),
                share()
            );
    }

    ngOnInit(): void {
        const THROTTLE_EVENTS_TIME = 500;
        this.initChat();
        this.createMessageObservable();

        this.borderScrolled.appBorderScrolled
            .pipe(
                filter(() => !this.inProgress),
                throttleTime(THROTTLE_EVENTS_TIME)
            )
            .subscribe(() => this.loadChatMessages(this.chatId));
    }

    scrollToBottom(): void {
        window.requestAnimationFrame(() => {
            this.chatFeed.nativeElement.scrollTop = this.chatFeed.nativeElement.scrollHeight;
        });
    }

    private initChat(): void {
        this.activeChat
            .subscribe((chat) => {
                this.pagination = new PaginationParams();
                this.chatHistory.next([]);
                this.innerMessages = [];
                this.firstTimeLoad = true;
                this.loadMore = true;
                this.chatId = chat.id;
                this.loadChatMessages(this.chatId, this.firstTimeLoad);
            });
    }

    private createMessageObservable(): void {
        this.messages = this.chatHistory
            .pipe(
                merge(this.newMessage),
                map((messages) => {
                    console.log("add new message data");
                    // TODO: sort data
                    this.innerMessages = this.innerMessages
                        .concat(messages);
                    return this.innerMessages;
                }),
                share()
            );
    }

    private loadChatMessages(chatId: number, firstTime = false): void {
        if (!this.loadMore) {
            return;
        }
        this.inProgress = true;
        this.chatsService.getMessages(chatId, this.pagination)
            .subscribe(({data, pagination}) => {
                this.addMessagesToHistory(data.reverse());
                if (firstTime) {
                    this.scrollToBottom();
                }
                this.firstTimeLoad = false;
                this.pagination.next();

                console.log("inner messages: ", this.innerMessages.length);
                console.log("TOTAL: ", pagination.total);
                console.log(this.innerMessages);

                this.loadMore = this.innerMessages.length < pagination.total;
                this.inProgress = false;
            });
    }

    private addMessagesToHistory(chatMessages: Message[]): void {
        console.log("append new messages portion")
        const oldMessages = this.chatHistory.getValue();
        this.chatHistory.next([...chatMessages, ...oldMessages]);
    }
}
