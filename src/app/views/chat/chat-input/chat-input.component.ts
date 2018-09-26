import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";

import { ChatsService } from "../../../services/chats.service";

@Component({
    selector: "app-chat-input",
    templateUrl: "./chat-input.component.html",
    styleUrls: ["./chat-input.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatInputComponent implements OnInit {
    messageForm: FormGroup;

    constructor(private readonly chatsService: ChatsService) {
    }

    get invalidForm(): Observable<boolean> {
        return of(this.messageForm.invalid && this.messageForm.get("message").value);
    }

    ngOnInit(): void {
        this.messageForm = new FormGroup(
            {
                message: new FormControl("", [Validators.required])
            },
            {}
        );
    }

    sendMessage(): void {
        if (this.messageForm.valid) {
            this.chatsService.sendMessage(this.messageForm.get("message").value)
                .subscribe(() => {
                    this.messageForm.reset();
                });
        }
    }
}
