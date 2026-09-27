import { Message } from './message.models';

export interface Chat {
  id: number;
  imgSrc?: string;
  name?: string;
  members?: string[];
  receiverId: string;
  messages: Message[];
  isOnline: boolean;
  isRead: boolean;
  isPrivate: boolean;
  shareLink: string;
  description: string;
}
