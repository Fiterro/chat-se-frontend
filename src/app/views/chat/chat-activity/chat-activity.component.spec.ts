import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChatActivityComponent } from "./chat-activity.component";

describe("ChatActivityComponent", () => {
    let component: ChatActivityComponent;
    let fixture: ComponentFixture<ChatActivityComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChatActivityComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatActivityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
