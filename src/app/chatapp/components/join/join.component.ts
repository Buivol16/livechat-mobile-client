import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../services/chat/chatservice';
import { ChatPreview } from '../../models/chatpreview.models';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrl: './join.component.css',
  standalone: true,
  imports: [],
})
export class JoinWindowComponent implements OnInit {
  private code?: string | null;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly chatService = inject(ChatService);
  readonly chatPreview = signal<ChatPreview | undefined>(undefined);

  ngOnInit(): void {
    this.code = this.route.snapshot.paramMap.get('id');
    if (this.code) {
      this.chatService.getChatPreview(this.code!).subscribe({
        next: (val) => {
          this.chatPreview.set(val);
        },
      });
    }
  }

  acceptInvite() {
    if (this.code) {
      this.chatService.joinToChat(this.code, () => this.closeWindow());
    }
  }

  closeWindow() {
    this.router.navigate(['/main']);
  }
}
