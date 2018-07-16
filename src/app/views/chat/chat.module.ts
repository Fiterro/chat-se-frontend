import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ChatMainComponent } from "./chat-main/chat-main.component";
import { ChatFeedComponent } from "./chat-feed/chat-feed.component";
import { ChatInputComponent } from "./chat-input/chat-input.component";
import { ChatListComponent } from "./chat-list/chat-list.component";
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatListModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule
    ],
    declarations: [
        ChatMainComponent,
        ChatFeedComponent,
        ChatInputComponent,
        ChatListComponent
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
