import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";

import { Chat } from "../../../core/classes/chat";
import { ChatsService } from "../../../services/chats.service";
import { BehaviorSubject } from "rxjs";
import { TimelineItem } from "../../../core/classes/timeline-item.class";

@Component({
    selector: "app-chat-activity",
    templateUrl: "./chat-activity.component.html",
    styleUrls: ["./chat-activity.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatActivityComponent implements OnInit {
    @Input() chat: Chat;

    readonly elements = new BehaviorSubject<TimelineItem[]>([]);

    constructor(private readonly matDialogRef: MatDialogRef<ChatActivityComponent>,
                private readonly chatsService: ChatsService) {
    }

    ngOnInit() {
        this.chatsService.getChatActivity(this.chat.id)
            .subscribe((chatInfo) => this.elements.next(chatInfo));
    }

}
