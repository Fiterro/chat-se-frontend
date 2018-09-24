import { UserData } from "../types/user.type";
import { UserShort } from "../types/user-short.type";
import { SessionData } from "../types/session.type";

export class User {
    readonly profile: UserShort;
    session: SessionData;

    constructor(user: UserData) {
        this.profile = user.profile;
        this.session = user.session;
    }
}
