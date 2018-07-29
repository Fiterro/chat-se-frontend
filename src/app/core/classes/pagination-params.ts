import { HttpParams } from "@angular/common/http";

export class PaginationParams {
    private readonly limit: number = 20;
    private offset: number = 0;

    constructor(data?: { limit: number, offset: number }) {
        if (data && data.limit) {
            this.limit = data.limit;
        }

        if (data && data.offset) {
            this.limit = data.offset;
        }
    }

    next(): void {
        this.offset = this.offset + this.limit;
    }

    toHttpParams(): HttpParams {
        let params = new HttpParams();

        if (this.limit !== undefined) {
            params = params.set("limit", this.limit.toString(10));
        }

        if (this.offset !== undefined) {
            params = params.set("offset", this.offset.toString(10));
        }

        return params;
    }
}
