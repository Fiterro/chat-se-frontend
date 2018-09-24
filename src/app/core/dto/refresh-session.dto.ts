export class RefreshSessionDto {
    readonly refreshToken: string;

    constructor(refreshToken: string) {
        this.refreshToken = refreshToken;
    }
}
