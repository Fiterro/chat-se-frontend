import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ChatMainComponent } from "./chat-main/chat-main.component";
import { ChatFeedComponent } from "./chat-feed/chat-feed.component";
import { ChatInputComponent } from "./chat-input/chat-input.component";
import { ChatListComponent } from "./chat-list/chat-list.component";
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { CapitalizeFirstModule } from "../../shared/pipes/capitalize-first/capitalize-first.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatListModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        CapitalizeFirstModule
    ],
    declarations: [
        ChatMainComponent,
        ChatFeedComponent,
        ChatInputComponent,
        ChatListComponent,
        ChatMessageComponent
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
