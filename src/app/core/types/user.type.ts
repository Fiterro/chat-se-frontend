import { UserShort } from "./user-short.type";

export type UserData = Readonly<{
    profile: UserShort,
    session: any
}>;
