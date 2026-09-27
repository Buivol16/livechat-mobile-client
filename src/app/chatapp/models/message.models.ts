export interface Message {
    id: number | null;
    chatId: number;
    authorId: string;
    receiverId: string;
    encryptedMessage: string;
    isPrivateChat: boolean;
    createdAt: Date;
    modifiedAt: Date | null;
    deletedForAll: boolean;
    deletedForAuthorOnly: boolean;
    formattedDate?: string;
    senderImage: string;
    isMyMessage: boolean;
    isRead: boolean;
    isSent: boolean;
    correlationId?: string;
}