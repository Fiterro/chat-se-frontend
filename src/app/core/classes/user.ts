import { UserData } from "../types/user.type";
import { UserShort } from "../types/user-short.type";

export class User {
    readonly token: string;
    readonly email: string;
    readonly profile: UserShort;

    constructor(user: UserData) {
        this.token = user.token;
        this.email = user.email;
        this.profile = user.profile;
    }
}
