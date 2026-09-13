import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  ViewChild,
  viewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../../models/message.models';
import { ChatService } from '../../services/chat/chatservice';
import { MessageComponent } from '../message/message.component';
import { MessageService } from '../../services/message/messageservice';
import { ChatScrollService } from '../../services/scroll/chatscrollservice';
import { MessageReadEvent } from '../../models/messagereadevent.models';
import { ChatProfile } from '../chatprofile/chatprofile.component';
import { Member } from '../../models/member.models';
import { Router, RouterOutlet } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrl: './chatwindow.component.css',
  standalone: true,
  imports: [
    FormsModule,
    MessageComponent /* ChatProfileImageComponent*/,
    ChatProfile,
    RouterOutlet,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent
],
  host: {
    class: 'w-full',
  },
})
export class ChatWindowComponent {
  readonly chatService = inject(ChatService);
  readonly messageService = inject(MessageService);
  readonly chatScrollService = inject(ChatScrollService);
  readonly router = inject(Router);
  readonly message = signal('');
  readonly currChat = this.chatService.getCurrentChatSignal();
  readonly receiverId = computed(() => {
    if (this.currChat()!.isPrivate) return this.currChat()!.receiverId;
    else return 'null';
  });

  readonly chatProfileOpened = signal(false);

  @ViewChild('chatContainer')
  private chatContainer?: ElementRef<HTMLDivElement>;

  timeoutId: number | undefined;
  readonly checkedMessages = signal<MessageReadEvent[]>([]);

  readonly renderedMessages = viewChildren(MessageComponent);

  constructor() {
    afterRenderEffect(() => {
      const chat = this.currChat();
      const messagesReceived = this.messageService.getMessagesSignal();

      if (!chat || !messagesReceived() || !this.chatContainer) return;

      const nativeElement = this.chatContainer?.nativeElement;
      const scrollHeight = nativeElement.scrollHeight;

      if (this.renderedMessages().length !== chat.messages.length) return;

      console.log('Scroll height: ' + scrollHeight);
      this.chatScrollService.registerChatContainer(this.chatContainer);
      this.chatScrollService.restorePosition(chat.id);
    });
  }

  openShareWindow() {
    this.router.navigate(['/main/chat/share']);
  }

  removeUser(mem: Member) {
    this.chatService.kickMember(mem);
  }

  sendMyMessage(event: SubmitEvent) {
    if (this.message().trim().length < 1) return;
    const chat = this.currChat()!;

    const mess: Message = {
      encryptedMessage: this.message(),
      id: null,
      isMyMessage: true,
      authorId: 'null',
      senderImage: 'img/avatarka.png',
      createdAt: new Date(),
      isPrivateChat: true,
      chatId: chat.id,
      deletedForAll: false,
      deletedForAuthorOnly: false,
      modifiedAt: null,
      receiverId: this.currChat()!.receiverId,
      isRead: false,
      isSent: false,
    };

    this.messageService.sendMessage(mess, chat);

    this.message.set('');
    event.preventDefault();
  }

  haveNextMessageFromSameSender(currentMessage: Message, currentIndex: number) {
    const nextMessage = this.chatService.getMessages()[currentIndex + 1];
    if (nextMessage && currentMessage.authorId === nextMessage.authorId) {
      return true;
    } else {
      return false;
    }
  }

  getChatName() {
    return this.chatService.getCurrentChatName();
  }

  getChatImage() {
    return this.chatService.getCurrentChatImage();
  }

  isFirstMessage(mes: Message, index: number) {
    const messages = this.currChat()!.messages;
    if (messages[index - 1] === undefined) return true;
    else return messages[index - 1].id !== mes.id;
  }

  isLastMessage(mes: Message, index: number) {
    const messages = this.currChat()!.messages;
    return (
      messages[index + 1] === undefined || messages[index + 1].id !== mes.id
    );
  }

  writeCheckedMessageId(id: number, authorId: string) {
    this.checkedMessages.update((val) => [...val, { messageId: id, authorId }]);

    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.messageService.checkMessages(this.checkedMessages());
      this.checkedMessages.set([]);
    }, 2000);
  }
}
