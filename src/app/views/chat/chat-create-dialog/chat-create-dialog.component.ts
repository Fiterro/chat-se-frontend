import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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

    ngOnInit() {
        this.formGroup = new FormGroup({chatName: new FormControl("", [Validators.required])});
    }

    get invalidForm(): Observable<boolean> {
        return of(this.formGroup.invalid);
    }

    submitForm(): void {
        if (this.formGroup.valid) {
            this.matDialogRef.close(this.formGroup.get("chatName").value);
        }
    }
}
