import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChatCreateDialogComponent } from "./chat-create-dialog.component";

describe("ChatCreateDialogComponent", () => {
    let component: ChatCreateDialogComponent;
    let fixture: ComponentFixture<ChatCreateDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChatCreateDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatCreateDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
