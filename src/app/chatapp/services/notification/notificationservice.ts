import { inject, Injectable, OnDestroy } from '@angular/core';
import { Client, messageCallbackType, StompSubscription } from '@stomp/stompjs';
import KeycloakService from '../keycloak/keycloakservice';
import { HttpClient } from '@angular/common/http';
import { ChatService } from '../chat/chatservice';
import { Message } from '../../models/message.models';
import { MessageReadEvent } from '../../models/messagereadevent.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'any',
  deps: [KeycloakService],
})
export default class NotificationService implements OnDestroy {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);
  private readonly chatService = inject(ChatService);

  private readonly NOTIFICATION_SERVICE_URL = `${environment.notificationServiceWebsocketUrl}/notification`;

  private readonly NOTIFICATION_CONFIRMED_URL = `${environment.apiUrl}/notification-service/notification/confirm`;

  private readonly NEW_MESSAGE_NOTIFICATION_URL = '/user/topic/notification';

  private readonly READ_MESSAGE_EVENT_NOTIFICATION_URL =
    '/user/topic/message/read';

  private readonly USER_JOINS_EVENT_NOTIFICATION_URL = '/user/topic/user/joins';

  private userJoinsEventSubscriptionId?: string;

  private socket: Client = new Client({
    brokerURL: this.NOTIFICATION_SERVICE_URL,
    connectHeaders: {
      Authorization: this.keycloakService.getToken(),
    },
    onConnect: (frame) => {
      console.log('[STOMP] connected:', JSON.stringify(frame.headers));
      this.listenNotification();
    },
    onWebSocketError: () => {
      setTimeout(() => this.listenNotification(), 2000);
    },
  });
  private subscription: StompSubscription | undefined;

  constructor() {
    this.socket.activate();
  }

  public listenNotification() {
    if (this.socket && this.socket.connected) {
      console.log('[STOMP] TRYING TO GET TOKEN FROM KEYCLOAK');
      this.socket.connectHeaders = {};
      this.subscribeToNotificationTopic();
      this.subscribeToReadMessageTopic();
    }
  }
  subscribeToReadMessageTopic() {
    this.socket.subscribe(
      this.READ_MESSAGE_EVENT_NOTIFICATION_URL,
      (message) => {
        console.log('[STOMP CLIENT] readed your message');
        const messageReads: MessageReadEvent = JSON.parse(message.body);
        this.chatService.readMessage(messageReads);
        console.log(`[STOMP CLIENT] message ids that was read ${messageReads}`);
      },
    );
  }

  getChatMemberUpdate(callback: messageCallbackType) {
    this.userJoinsEventSubscriptionId = this.socket.subscribe(
      this.USER_JOINS_EVENT_NOTIFICATION_URL,
      callback,
    ).id;
  }

  unsubscribeChatMemberUpdate() {
    if (this.userJoinsEventSubscriptionId) {
      this.socket.unsubscribe(this.userJoinsEventSubscriptionId);
    }
  }

  private subscribeToNotificationTopic() {
    this.socket.subscribe(this.NEW_MESSAGE_NOTIFICATION_URL, (message) => {
      console.log('[STOMP CLIENT] received new message');
      const json = JSON.parse(message.body);
      const parsed: Message = json.message;
      parsed.correlationId = json.correlationId;
      parsed.formattedDate = this.getFormattedDate(parsed.createdAt);
      const notificationUuid = json.notificationUuid;
      this.chatService.addMessageToSelectedChat(parsed);
      this.http
        .post(this.NOTIFICATION_CONFIRMED_URL, {
          notificationUuid,
        })
        .subscribe();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private getFormattedDate(date: Date) {
    const when: Date = new Date(date);
    let minutes = '' + when.getMinutes();
    if (Number.parseInt(minutes) < 10) minutes = '0' + minutes;
    return when.getHours() + ':' + minutes;
  }
}

// debug: function (message) {
//     console.log(message);
//     log("[DEBUG] " + message);
// },

// onConnect: function (frame) {
//     log("Connected to STOMP");
//     log("Frame: " + JSON.stringify(frame.headers));

//     this.subscribe("/topic/notification", function (message) {
//         log("Received from /topic/notification:");
//         log(message.body);
//     });
//     stompClient.subscribe("/user/topic/notification", function (message) {
//         log("Received from /user/topic/notification:");
//         log(message.body);
//         fetch("http://localhost:8080/notification/confirm",{method: "POST", headers: {'Authorization': token}, body: JSON.parse(message.body).notificationUuid});
//     });

//     log("Subscribed to:");
//     log("- /topic/notification");
//     log("- /user/topic/notification");
// },

// onStompError: function (frame) {
//     log("STOMP error:");
//     log("Message: " + frame.headers["message"]);
//     log("Body: " + frame.body);
// },

// onWebSocketError: function (error) {
//     log("WebSocket error:");
//     log(error);
// },

// onWebSocketClose: function () {
//     log("WebSocket connection closed");
// }
