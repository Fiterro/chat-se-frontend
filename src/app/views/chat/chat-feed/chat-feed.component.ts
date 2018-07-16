import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Observable } from "rxjs";

import { ChatsService } from "../../../services/chats.service";
import { Chat } from "../../../core/classes/chat";

@Component({
    selector: "app-chat-feed",
    templateUrl: "./chat-feed.component.html",
    styleUrls: ["./chat-feed.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatFeedComponent {

    constructor(private readonly chatsService: ChatsService) {
    }

    get activeChat(): Observable<Chat> {
        return this.chatsService.activeChat;
    }
}
