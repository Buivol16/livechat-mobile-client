import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { MessageService } from '../../services/message/messageservice';
import { MessageReadEvent } from '../../models/messagereadevent.models';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
  imports: [NgClass],
})
export class MessageComponent implements AfterViewInit {
  readonly isMyMessage = input(false);
  readonly message = input('');
  readonly isCompoundMessage = input(false);
  readonly isFirstMessageInCompound = input(false);
  readonly isLastMessageInCompound = input(false);
  readonly when = input.required<string>();
  readonly isChecked = input.required<boolean>();
  readonly isSent = input.required<boolean>();
  readonly id = input.required<number>();
  readonly authorId = input.required<string>();
  readonly messageService = inject(MessageService);

  private readonly visibilityThreshold = 0.6;

  @ViewChild('messageContainer')
  private readonly messageElem?: ElementRef<HTMLDivElement>;

  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;

  readonly writeCheckedMessage = output<MessageReadEvent>();

  ngAfterViewInit(): void {
    if (!this.messageElem) return;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= this.visibilityThreshold &&
          !this.isChecked() &&
          !this.isMyMessage()
        ) {
          this.writeCheckedMessage.emit({messageId: this.id(), authorId: this.authorId()});
        }
      },
      {
        threshold: this.visibilityThreshold,
      },
    );

    this.observer.observe(this.messageElem.nativeElement);

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
    });
  }
}
