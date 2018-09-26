import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InViewportModule } from "ng-in-viewport";

import { ChatMainComponent } from "./chat-main/chat-main.component";
import { ChatFeedComponent } from "./chat-feed/chat-feed.component";
import { ChatInputComponent } from "./chat-input/chat-input.component";
import { ChatListComponent } from "./chat-list/chat-list.component";
import { ChatMessageComponent } from "./chat-message/chat-message.component";
import { CapitalizeFirstModule } from "../../shared/pipes/capitalize-first/capitalize-first.module";
import { ChatCreateDialogComponent } from "./chat-create-dialog/chat-create-dialog.component";
import { ChatActivityComponent } from "./chat-activity/chat-activity.component";
import { TimelineModule } from "../../shared/timeline/timeline.module";
import { BorderScrolledModule } from "../../shared/border-scrolled/border-scrolled.module";
import { FlipModule } from "../../shared/flip/flip.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        MatListModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        CapitalizeFirstModule,
        MatDialogModule,
        TimelineModule,
        BorderScrolledModule,
        FlipModule,
        InViewportModule
    ],
    declarations: [
        ChatMainComponent,
        ChatFeedComponent,
        ChatInputComponent,
        ChatListComponent,
        ChatMessageComponent,
        ChatCreateDialogComponent,
        ChatActivityComponent
    ],
    entryComponents: [
        ChatCreateDialogComponent,
        ChatActivityComponent
    ],
    exports: [
        ChatMainComponent,
        ChatFeedComponent,
        ChatInputComponent,
        ChatListComponent
    ]
})
export class ChatModule {
}
