import { inject, TestBed } from "@angular/core/testing";

import { BrowserNotificationsService } from "./browser-notifications.service";

describe("BrowserNotificationsService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BrowserNotificationsService]
        });
    });

    it("should be created", inject([BrowserNotificationsService], (service: BrowserNotificationsService) => {
        expect(service).toBeTruthy();
    }));
});
