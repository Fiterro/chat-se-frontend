export type MessageData = Readonly<{
    id: number,
    chatId: number,
    senderId: number,
    sender: any,
    text: string,
    status: number,
    viewCount: number,
    sentAt: string,
    createdAt: string,
    updatedAt: string
}>;
