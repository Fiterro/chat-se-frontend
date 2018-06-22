export class AppStorage<T> {
    private static readonly APP_PREFIX = "chat-se";

    private readonly key: string;
    private readonly storage: Storage;

    constructor(storage: Storage, key: string) {
        if (!key.length) {
            throw new Error("You must specify key for your storage");
        }

        this.key = [AppStorage.APP_PREFIX, key].join("::");
        this.storage = storage;
    }

    setItem(value: T): void {
        this.storage.setItem(this.key, JSON.stringify(value));
    }

    getItem(): Readonly<T> {
        return (this.storage.getItem(this.key)) ? JSON.parse(this.storage.getItem(this.key)) : null;
    }

    removeItem(): void {
        this.storage.removeItem(this.key);
    }
}
