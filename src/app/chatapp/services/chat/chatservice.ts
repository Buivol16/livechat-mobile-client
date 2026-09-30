import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from '../../models/chat.models';
import { Message } from '../../models/message.models';
import { MessageService } from '../message/messageservice';
import KeycloakService from '../keycloak/keycloakservice';
import { MessageReadEvent } from '../../models/messagereadevent.models';
import { Member } from '../../models/member.models';
import { ChatPreview } from '../../models/chatpreview.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly CHAT_SERVICE_URL_PREFIX = `${environment.apiUrl}/chat-service/chat`;
  readonly http = inject(HttpClient);
  readonly messageService = inject(MessageService);
  readonly keycloakService = inject(KeycloakService);
  private selectedChat: WritableSignal<Chat | undefined> = signal(undefined);
  // readonly privateChats?: Chat[] = [this.createPrivateChat("Denys Khmara", false, [this.createMessage("Where are you?", false, "Denys Khmara", 'img/dkhmara.png', new Date(), false)], 'img/dkhmara.png'), this.createPrivateChat("Kevin McGrace", true, undefined, 'img/kmcgrace.png'), this.createPrivateChat("Catherine River", true, undefined, 'img/criver.png')];
  // readonly publicChats?: Chat[] = [this.createPublicChat('Cat lovers', undefined, 'img/catloversavatar.png'), this.createPublicChat('Dog lovers', undefined, 'img/dogloversavatar.png'), this.createPublicChat('Monke funny', undefined, 'img/monkeavatar.png')];
  readonly messages = signal<Message[]>([]);
  getPrivateChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.CHAT_SERVICE_URL_PREFIX + '/private');
  }

  getPublicChats() {
    return this.http.get<Chat[]>(this.CHAT_SERVICE_URL_PREFIX + '/public');
  }

  getChatPreview(code: string) {
    return this.http.get<ChatPreview>(
      this.CHAT_SERVICE_URL_PREFIX + '/chat-preview',
      {
        params: {
          code: code,
        },
      },
    );
  }

  selectChat(chat: Chat) {
    if (chat) {
      this.selectedChat.update(() => chat);
      this.tryGetMessages(chat);
    }
  }

  joinToChat(code: string, onComplete: () => void) {
    this.http
      .post(`${this.CHAT_SERVICE_URL_PREFIX}/join/${code}`, null)
      .subscribe({
        complete: onComplete,
      });
  }

  readMessage(messageIds: MessageReadEvent) {
    const chat = this.selectedChat();
    if (chat) {
      chat.messages.find(
        (message) => message.id === messageIds.messageId,
      )!.isRead = true;
    }
  }

  getShareCode(chatId: number) {
    return this.http.get(this.CHAT_SERVICE_URL_PREFIX + '/create-invite', {
      params: {
        chatId: chatId,
      },
      observe: 'body',
      responseType: 'text',
    });
  }

  getMembersOfChat(chatId: number) {
    return this.http.get<Member[]>(this.CHAT_SERVICE_URL_PREFIX + '/members', {
      params: {
        chatId: chatId,
      },
    });
  }

  kickMember(mem: Member) {
    this.http
      .delete(this.CHAT_SERVICE_URL_PREFIX + '/remove-member', {
        params: {
          memId: mem.id,
        },
      })
      .subscribe();
  }

  private tryGetMessages(chat: Chat) {
    this.messageService
      .getAllMessagesByChatIdAndIsPrivate(chat.id, true)
      .subscribe({
        next: (messages: Message[]) => {
          this.messageService.setMessagesSignal(true);
          messages.forEach((message) => {
            message.isSent = true;
            message.formattedDate = this.getFormattedDate(message.createdAt);
            message.correlationId = undefined;
          });
          chat.messages = [...messages];
        },
        error: () => {
          setTimeout(() => this.tryGetMessages(chat), 5000);
        },
      });
  }

  createNewChat() {
    throw new Error('Method not implemented.');
  }

  // createPrivateChat(name: string, isOnline = false, allMessages: Message[] = [], imgSrc: string) : Chat{
  //     return { id: name: name, messages: allMessages, isOnline: isOnline, isRead: false, imgSrc: imgSrc};
  // }

  // createPublicChat(name: string, allMessages: Message[] = [], imgSrc: string) : Chat{
  //     return { name: name, messages: allMessages, isOnline: false, isRead: false, imgSrc: imgSrc, id: 0,};
  // }

  private getFormattedDate(date: Date) {
    const when: Date = new Date(date);
    let minutes = '' + when.getMinutes();
    if (Number.parseInt(minutes) < 10) minutes = '0' + minutes;
    return when.getHours() + ':' + minutes;
  }

  getCurrentChatName(): string {
    if (this.selectedChat() && this.selectedChat()!.name) {
      return this.selectedChat()!.name!;
    } else {
      return 'Select chat';
    }
  }

  getCurrentChatImage() {
    if (this.selectedChat() && this.selectedChat()!.imgSrc) {
      return this.selectedChat()!.imgSrc!;
    } else {
      return null;
    }
  }

  getCurrentChatSignal(): WritableSignal<Chat | undefined> {
    return this.selectedChat;
  }

  getMessages() {
    if (this.selectedChat()) {
      return this.selectedChat()!.messages;
    } else {
      return [];
    }
  }

  addMessageToSelectedChat(message: Message) {
    const chat = this.selectedChat;
    if (chat() && message.chatId === chat()!.id) {
      chat.update((val) => {
        const foundMessage = val!.messages.filter(
          (mes) => mes.correlationId === message.correlationId,
        )[0];
        if (foundMessage) {
          foundMessage.id = message.id;
          foundMessage.authorId = message.authorId;
          return val;
        }
        val!.messages = [...chat()!.messages, message];
        return val;
      });
    } else {
      console.error('[HANDLED ERROR] There is no selected chat');
    }
  }

  // private createMessage(content: string, isMyMessage: boolean, sender: string, senderImage: string, timestamp: Date, isRead: boolean, chatId: number, receiverId: string): Message{
  //     return {
  //         encryptedMessage: content,
  //         id: null,
  //         isMyMessage: isMyMessage,
  //         authorId: sender,
  //         senderImage: senderImage,
  //         createdAt: timestamp,
  //         isRead: isRead,
  //         chatId: chatId,
  //         deletedForAll: false,
  //         deletedForAuthorOnly: false,
  //         //todo change it when make possible to send messages for public chats
  //         isPrivateChat: true,
  //         modifiedAt: null,
  //         receiverId: receiverId
  //     };
  // }
}
