import { UserData } from "../types/user.type";

export class User {
    id: number;
    token: string;

    constructor(user: UserData) {
        this.id = user.id;
        this.token = user.token;
    }
}
