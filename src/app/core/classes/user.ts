import { UserData } from "../types/user.type";
import { UserShort } from "../types/user-short.type";

export class User {
    readonly profile: UserShort;
    readonly session: any;

    constructor(user: UserData) {
        console.log(user);
        this.profile = user.profile;
        this.session = user.session;
    }
}
