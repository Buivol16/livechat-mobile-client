import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Message } from '../../models/message.models';
import { Chat } from '../../models/chat.models';
import KeycloakService from '../keycloak/keycloakservice';
import { MessageReadEvent } from '../../models/messagereadevent.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly MESSAGE_SERVICE_URL_PREFIX = `${environment.apiUrl}/message-service/message`;
  readonly http = inject(HttpClient);
  readonly keycloakService = inject(KeycloakService);
  readonly messagesReceived = signal(false);

  sendMessage(message: Message, chat: Chat) {
    const oldMessages = chat.messages;
    this.trySendMessage(message, chat);
    message.formattedDate = this.getFormattedDate(message.createdAt);
    chat.messages = [...oldMessages!, message];
  }

  private trySendMessage(message: Message, chat: Chat) {
    this.http
      .post(this.MESSAGE_SERVICE_URL_PREFIX, message, {
        observe: 'response',
      })
      .subscribe({
        complete() {
          message.isSent = true;
        },
        error: () => {
          setTimeout(() => this.trySendMessage(message, chat), 5000);
        },
        next: (val) => {
          const corrId = val.headers.get('X-Correlation-Id');
          if (!corrId) return;
          message.correlationId = corrId;
        },
      });
  }

  getAllMessagesByChatIdAndIsPrivate(chatId: number, isPrivate: boolean) {
    const request = this.http.get<Message[]>(this.MESSAGE_SERVICE_URL_PREFIX, {
      params: {
        chatId: chatId,
        isPrivate: isPrivate,
      },
    });
    return request;
  }

  getMessagesSignal() {
    return this.messagesReceived;
  }

  setMessagesSignal(val: boolean) {
    this.messagesReceived.set(val);
  }

  checkMessages(messageIds: MessageReadEvent[]) {
    const ids = messageIds.join(',');
    console.log(`[DEBUG] checking message with id ${ids}`);
    this.http
      .patch(this.MESSAGE_SERVICE_URL_PREFIX + '/read', [...messageIds])
      .subscribe();
  }

  private getFormattedDate(date: Date) {
    const when: Date = new Date(date);
    let minutes = '' + when.getMinutes();
    if (Number.parseInt(minutes) < 10) minutes = '0' + minutes;
    return when.getHours() + ':' + minutes;
  }
}
