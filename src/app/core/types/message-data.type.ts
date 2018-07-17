export type MessageData = Readonly<{
    id: number,
    chatId: number,
    senderId: number,
    text: string,
    status: number,
    viewCount: number,
    created_at: string,
    updated_at: string
}>;
