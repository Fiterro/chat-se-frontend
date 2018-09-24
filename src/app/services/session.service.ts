import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { User } from "../core/classes/user";
import { AppStorage } from "../core/helpers/app-storage";
import { UserData } from "../core/types/user.type";

@Injectable({
    providedIn: "root"
})
export class SessionService {
    readonly isAdmin = new BehaviorSubject<boolean | undefined>(undefined);

    private readonly userStorage = new AppStorage<UserData>(localStorage, "user");
    private readonly innerUser = new BehaviorSubject<User | undefined>(undefined);

    constructor() {
        const user = this.userStorage.getItem();

        if (user) {
            this.innerUser.next(new User(user));
        }

        this.user
            .subscribe((u) => {
                if (!u) {
                    this.isAdmin.next(undefined);
                    this.userStorage.removeItem();
                } else {
                    this.userStorage.setItem(u);
                }
            });
    }

    get user(): Observable<User | undefined> {
        return this.innerUser.asObservable();
    }

    get userSnapshot(): User | undefined {
        return this.innerUser.getValue();
    }

    set(u: User): void {
        this.innerUser.next(u);
    }
}
