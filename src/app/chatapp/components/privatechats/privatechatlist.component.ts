import { Component, inject, signal, WritableSignal } from "@angular/core";
import { ChatService } from "../../services/chat/chatservice";
import { Chat } from "../../models/chat.models";
import { ChatComponent } from "../chat/chat.component";
import { IonItem } from "@ionic/angular";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-private-chat-list',
  templateUrl: './privatechatlist.component.html',
  styleUrl: './privatechatlist.component.css',
  imports: [ChatComponent, IonItem, RouterLink],
})
export class PrivateChatListComponent {
  readonly chatService = inject(ChatService);
  readonly chats: WritableSignal<Chat[]> = signal([]);

  constructor() {
    this.getAndMapChats();
  }

  getAndMapChats() {
    const result = this.chatService.getPrivateChats();
    result.subscribe((objs) => {
      this.chats?.update((chats) => {
        chats = objs.map((object) => ({
          ...object,
          members: [],
          messages: [],
          isPrivate: true,
        }));
        return chats;
      });
    });
  }

  getNowDate(chat: Chat) {
    if (chat.messages.length > 0) {
      return chat.messages[chat.messages.length - 1].createdAt;
    } else {
      return null;
    }
  }

  getLastMessageContent(chat: Chat) {
    return chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1].encryptedMessage
      : '';
  }
}
