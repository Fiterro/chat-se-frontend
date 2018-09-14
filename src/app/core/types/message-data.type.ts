export type MessageData = Readonly<{
    id: number,
    chatId: number,
    text: string,
    sender: any,
    viewCount: number,
    sentAt: string,
    createdAt: string,
    updatedAt: string
}>;
