import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { filter, map, merge, share, tap, throttleTime } from "rxjs/operators";

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
    private readonly messagesCached = new BehaviorSubject<Message[]>([]);
    private innerMessages: Message[] = [];
    private pagination: PaginationParams;
    private loadMore = false;
    private inProgress = false;
    private chatId: number;
    private firstTimeLoad = true;

    constructor(private readonly chatsService: ChatsService) {
    }

    get noMessages(): Observable<boolean> {
        return of(this.innerMessages)
            .pipe(
                map((messages) => !messages.length)
            );
    }

    private get activeChat(): Observable<Chat> {
        return this.chatsService.activeChat;
    }

    private get newMessage(): Observable<Message[]> {
        return this.chatsService.newMessage
            .pipe(
                filter((message) => message.chatId === this.chatId),
                tap(() => this.scrollToBottom()),
                map((message) => [message])
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
                this.messagesCached.next([]);
                this.innerMessages = [];
                this.firstTimeLoad = true;
                this.loadMore = true;
                this.chatId = chat.id;
                this.loadChatMessages(this.chatId, this.firstTimeLoad);
            });
    }

    private createMessageObservable(): void {
        this.messages = combineLatest(this.chatHistory, this.messagesCached)
            .pipe(
                map(([history, cache]) => history.concat(cache)),
                map((messages) => {
                    // TODO: sort data
                    this.innerMessages = messages;
                    return this.innerMessages;
                }),
                merge(this.newMessage.pipe(
                    map((sent) => {
                        // TODO: filter for already in chat messages
                        this.cacheMessages(sent);

                        return this.innerMessages;
                    })
                )),
                share()
            );
    }

    private loadChatMessages(chatId: number, firstTime = false): void {
        if (!this.loadMore) {
            return;
        }
        this.inProgress = true;
        this.pagination.setOffset(this.innerMessages.length);
        this.chatsService.getMessages(chatId, this.pagination)
            .subscribe(({data, pagination}) => {
                this.addMessagesToHistory(data.reverse());
                if (firstTime) {
                    this.scrollToBottom();
                }
                this.firstTimeLoad = false;
                this.loadMore = this.innerMessages.length < pagination.total;
                this.inProgress = false;
            });
    }

    private addMessagesToHistory(chatMessages: Message[]): void {
        const oldMessages = this.chatHistory.getValue();
        this.chatHistory.next([...chatMessages, ...oldMessages]);
    }

    private cacheMessages(chatMessages: Message[]): void {
        const messagesCached = this.messagesCached.getValue();
        this.messagesCached.next([...messagesCached, ...chatMessages]);
    }
}
