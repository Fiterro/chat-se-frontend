import { Injectable } from "@angular/core";

import { Permission } from "../core/enums/permission.enum";

@Injectable({
    providedIn: "root"
})
export class BrowserNotificationsService {
    private permission: NotificationPermission;

    constructor() {
        this.permission = this.isSupported ? Permission.Default : Permission.Denied;
    }

    get isSupported(): boolean {
        return "Notification" in window;
    }

    requestPermissions(): void {
        if (this.isSupported) {
            Notification.requestPermission((status) => {
                return this.permission = status;
            });
        }
    }

    notify(title: string, options?: NotificationOptions): Notification {
        return new Notification(title, options);
    }
}
