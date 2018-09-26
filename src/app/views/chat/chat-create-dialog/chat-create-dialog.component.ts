import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { Observable, of } from "rxjs";

@Component({
    selector: "app-chat-create-dialog",
    templateUrl: "./chat-create-dialog.component.html",
    styleUrls: ["./chat-create-dialog.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatCreateDialogComponent implements OnInit {
    formGroup: FormGroup;

    constructor(public matDialogRef: MatDialogRef<ChatCreateDialogComponent>) {
    }

    get invalidForm(): Observable<boolean> {
        return of(this.formGroup.invalid);
    }

    ngOnInit() {
        this.formGroup = new FormGroup({chatName: new FormControl("", [Validators.required])});
    }

    submitForm(): void {
        if (this.formGroup.valid) {
            this.matDialogRef.close(this.formGroup.get("chatName").value);
        }
    }
}
