import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ChatsService } from "../../../services/chats.service";
import { Chat } from "../../../core/classes/chat";
import { Observable } from "rxjs";

@Component({
    selector: "app-chat-list",
    templateUrl: "./chat-list.component.html",
    styleUrls: ["./chat-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListComponent {

    constructor(private readonly chatsService: ChatsService) {
    }

    get chats(): Observable<Chat[]> {
        return this.chatsService.chats;
    }

    selectChat(chatId: number): void {
        this.chatsService.selectChat(chatId);
    }
}
