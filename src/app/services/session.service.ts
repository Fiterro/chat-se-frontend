import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { User } from "../core/classes/user";
import { AppStorage } from "../core/helpers/app-storage";
import { UserData } from "../core/types/user.type";

@Injectable({
    providedIn: "root"
})
export class SessionService {

    private readonly innerUser = new BehaviorSubject<User | undefined>(undefined);
    private readonly userStorage = new AppStorage<UserData>(localStorage, "user");

    get user(): Observable<User | undefined> {
        return this.innerUser.asObservable();
    }

    get userSnapshot(): User | undefined {
        return this.innerUser.getValue();
    }

    constructor() {
        const user = this.userStorage.getItem();

        if (user) {
            this.innerUser.next(new User(user));
        }

        this.user
            .subscribe((u) => {
                if (!u) {
                    this.userStorage.removeItem();
                } else {
                    this.userStorage.setItem(u);
                }
            });
    }

    set(u: User): void {
        this.innerUser.next(u);
    }
}
