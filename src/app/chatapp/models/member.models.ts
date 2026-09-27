import { Chat } from "./chat.models";
import { User } from "./user.models";

export interface Member{
    id: number;
    user: User;
    chat: Chat;
}