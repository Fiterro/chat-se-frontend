import { UserShort } from "./user-short.type";
import { SessionData } from "./session.type";

export type UserData = Readonly<{
    profile: UserShort,
    session: SessionData
}>;
