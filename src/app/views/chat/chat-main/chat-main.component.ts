import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ChatsService } from "../../../services/chats.service";

@Component({
    selector: "app-chat-main",
    templateUrl: "./chat-main.component.html",
    styleUrls: ["./chat-main.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMainComponent {

    constructor(private readonly chatsService: ChatsService) {
    }

    get activeChatName(): Observable<string> {
        return this.chatsService.activeChat
            .pipe(
                map((chat) => chat ? chat.name : "")
            );
    }

}
