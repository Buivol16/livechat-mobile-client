import {
  AfterViewInit,
  Component,
  inject,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { Chat } from '../../../models/chat.models';
import { Member } from '../../../models/member.models';
import { ChatService } from '../../../services/chat/chatservice';
import NotificationService from '../../../services/notification/notificationservice';
import { UserJoinsEvent } from '../../../models/userjoinsevent.models';

@Component({
  selector: 'app-chatprofile',
  templateUrl: './chatprofile.component.html',
  styleUrl: './chatprofile.component.css',
  standalone: true,
  imports: [],
  host: {
    class: 'w-full',
  },
})
export class ChatProfile implements AfterViewInit, OnDestroy {
  readonly members = signal<Member[]>([]);
  readonly chatService = inject(ChatService);
  readonly notificationService = inject(NotificationService);
  readonly chatDescription = input.required<string>();
  readonly chat = input.required<Chat>();
  readonly closeWindow = output();
  readonly removeUserFunc = output<Member>();

  ngAfterViewInit(): void {
    if (this.chat()) {
      this.chatService.getMembersOfChat(this.chat()!.id).subscribe({
        next: (val) => {
          this.members.set(val);
        },
      });

      this.notificationService.getChatMemberUpdate((val) => {
        const event: UserJoinsEvent = JSON.parse(val.body);
        this.members.update(members => [...members, event.member]);
      });
    }
  }

  ngOnDestroy(): void {
    this.notificationService.unsubscribeChatMemberUpdate();
  }

  removeUser(mem: Member) {
    this.removeUserFunc.emit(mem);
    this.members.set(this.members().filter((val) => val !== mem));
  }
}
