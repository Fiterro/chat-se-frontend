import { UserShort } from "./user-short.type";

export type UserData = Readonly<{
    token: string,
    email: string,
    profile: UserShort
}>;
