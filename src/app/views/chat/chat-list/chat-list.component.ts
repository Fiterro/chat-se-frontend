import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Observable } from "rxjs";
import { MatDialog } from "@angular/material";

import { ChatsService } from "../../../services/chats.service";
import { Chat } from "../../../core/classes/chat";
import { ChatCreateDialogComponent } from "../chat-create-dialog/chat-create-dialog.component";
import { ChatActivityComponent } from "../chat-activity/chat-activity.component";

@Component({
    selector: "app-chat-list",
    templateUrl: "./chat-list.component.html",
    styleUrls: ["./chat-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListComponent {

    constructor(private readonly chatsService: ChatsService,
                private readonly matDialog: MatDialog) {
    }

    get chats(): Observable<Chat[]> {
        return this.chatsService.chats;
    }

    selectChat(chatId: number): void {
        this.chatsService.selectChat(chatId);
    }

    onCreateClick(): void {
        const dialogRef = this.matDialog.open(ChatCreateDialogComponent, {width: "320px", hasBackdrop: true, disableClose: true});

        dialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.chatsService.createChat(result).subscribe();
                }
        });
    }

    onActivityClick(chat: Chat) {
        const dialogRef = this.matDialog.open(ChatActivityComponent, {hasBackdrop: true, disableClose: false});
        dialogRef.componentInstance.chat = chat;
    }
}
