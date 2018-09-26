import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, of, Subject, Subscription } from "rxjs";
import { debounceTime, filter, map, merge, share, switchMap, tap, throttleTime } from "rxjs/operators";

import { ChatsService } from "../../../services/chats.service";
import { Chat } from "../../../core/classes/chat";
import { Message } from "../../../core/classes/message";
import { PaginationParams } from "../../../core/classes/pagination-params";
import { BorderScrolledDirective } from "../../../shared/border-scrolled/border-scrolled.directive";

const THROTTLE_EVENTS_TIME = 500;

@Component({
    selector: "app-chat-feed",
    templateUrl: "./chat-feed.component.html",
    styleUrls: ["./chat-feed.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatFeedComponent implements OnInit, OnDestroy {
    messages: Observable<Message[]>;
    @ViewChild("feed")
    private readonly chatFeed: ElementRef;
    @ViewChild(BorderScrolledDirective)
    private readonly borderScrolled: BorderScrolledDirective;
    private readonly chatHistory = new BehaviorSubject<Message[]>([]);
    private readonly messagesCached = new BehaviorSubject<Message[]>([]);
    private readonly messageToRead = new Map<number, BehaviorSubject<Message>>();
    private readonly readMessage = new Subject<void>();
    private readonly subscriptions: Subscription[] = [];
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
                filter((message) => {
                    const existingMessageIndex = this.innerMessages.findIndex((innerMsg) => innerMsg.uuid === message.uuid);
                    if (existingMessageIndex >= 0) {
                        this.innerMessages[existingMessageIndex].setViewCount(message.viewCount.getValue());
                    }
                    return existingMessageIndex < 0;
                }),
                tap(() => this.scrollToBottom()),
                map((message) => [message])
            );
    }

    private get borderScrolledSubscription(): Subscription {
        return this.borderScrolled.appBorderScrolled
            .pipe(
                filter(() => !this.inProgress),
                throttleTime(THROTTLE_EVENTS_TIME)
            )
            .subscribe(() => this.loadChatMessages(this.chatId));
    }

    private get readMessagesSubscription(): Subscription {
        return this.readMessage
            .pipe(
                debounceTime(THROTTLE_EVENTS_TIME),
                filter(() => this.messageToRead.size > 0),
                switchMap(() => {
                    const messages = [];
                    this.messageToRead.forEach((message) => messages.push(message.getValue().id));
                    return this.chatsService.readMessages(this.chatId, messages);
                })
            )
            .subscribe((result) => {
                if (result.length) {
                    result.forEach((item) => {
                        const messageData = this.innerMessages
                            .find((message) => message.id === item.messageId);
                        if (messageData) {
                            messageData.setNew(false);
                            messageData.setViewCount(item.countViews);
                        }
                    });
                }
                this.messageToRead.clear();
            });
    }

    ngOnInit(): void {
        this.initChat();
        this.createMessageObservable();
        this.subscriptions
            .push(
                this.borderScrolledSubscription,
                this.readMessagesSubscription
            );
    }

    scrollToBottom(): void {
        window.requestAnimationFrame(() => {
            this.chatFeed.nativeElement.scrollTop = this.chatFeed.nativeElement.scrollHeight;
        });
    }

    onIntersection(data: Message): void {
        if (!data.isNewMessage.getValue()) {
            return;
        }
        if (this.messageToRead.has(data.id)) {
            return this.messageToRead.get(data.id).next(data);
        }
        this.messageToRead.set(data.id, new BehaviorSubject(data));
        this.readMessage.next();
    }

    ngOnDestroy(): void {
        this.messageToRead.clear();
        this.subscriptions.forEach(s => s.unsubscribe());
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
                merge(this.chatsService.messageSent.pipe(
                    map((sent) => {
                        this.cacheMessages([sent]);

                        return this.innerMessages;
                    }),
                    tap(() => this.scrollToBottom())
                )),
                merge(this.newMessage.pipe(
                    map((sent) => {
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
