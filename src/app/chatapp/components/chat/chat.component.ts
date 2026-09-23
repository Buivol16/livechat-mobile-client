import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat/chatservice';
import { Chat } from '../../models/chat.models';
import { ChatScrollService } from '../../services/scroll/chatscrollservice';

@Component({
  standalone: true,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  protected readonly chatService: ChatService = inject(ChatService);
  protected readonly chatScrollService = inject(ChatScrollService);
  protected readonly router = inject(Router);

  readonly imgSrc = input.required<string>();
  readonly chatName = input.required<string>();
  readonly lastMessage = input.required<string>();
  readonly whenLastMessage = input.required<Date | null>();
  readonly isRead = input(false);
  readonly showOnline = input(false);
  readonly isOnline = input(false);
  readonly lastOnMenuList = input.required<boolean>();
  readonly chat = input.required<Chat>();
  readonly isSelected = input.required<boolean>();

  selectThisChat() {
    const oldChat = this.chatService.getCurrentChatSignal()();
    if (oldChat) this.chatScrollService.save(oldChat.id);
    this.chatService.selectChat(this.chat());
  }

  getLastMessageDateFormatted() {
    const date = new Date(this.whenLastMessage()!);
    if (!date) return '';
    const month = date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth();

    if (date.getMilliseconds() - new Date().getMilliseconds() < 60000)
      return 'Now';

    return date.getDate() + '.' + month + '.' + date.getFullYear();
  }
}
