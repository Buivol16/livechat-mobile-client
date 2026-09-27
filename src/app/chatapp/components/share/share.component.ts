import { Component, computed, inject, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat/chatservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrl: './share.component.css',
  standalone: true,
  imports: [],
})
export class ShareWindowComponent implements OnInit {
  readonly chatService = inject(ChatService);
  readonly chat = computed(() => this.chatService.getCurrentChatSignal()());
  readonly router = inject(Router);

  ngOnInit(): void {
    this.getSharedLink();
  }

  getSharedLink() {
    const chat = this.chat();
    if (chat) {
      this.chatService.getShareCode(chat.id).subscribe({
        next: (value) => {
          const url = `${window.location.origin}/main/join/${value}`;
          chat.shareLink = url;
        },
      });
    } else {
      console.error('[HANDLED ERROR] Please, select chat to copy share link');
    }
  }

  closeWindow(){
    this.router.navigate(['main/chat']);
  }
}
