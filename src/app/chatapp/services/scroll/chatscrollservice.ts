import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatScrollService {
  private readonly storagePrefix = 'chat-scroll-position:';
  private chatContainer?: ElementRef<HTMLDivElement>;

  atTheEndOfScroll = false;
  timeoutId?: number;
  registerChatContainer(chatContainer: ElementRef<HTMLDivElement>) {
    this.chatContainer = chatContainer;
  }

  save(chatId: number): void {
    if (!this.chatContainer) return;

    sessionStorage.setItem(
      this.storagePrefix + chatId,
      this.chatContainer.nativeElement.scrollTop.toString(),
    );
  }

  get(chatId: number): number | null {
    const value = sessionStorage.getItem(this.storagePrefix + chatId);

    if (value === null) {
      return null;
    }

    const position = Number(value);

    return Number.isFinite(position) ? position : null;
  }

  remove(chatId: string): void {
    console.log('removing ');
    sessionStorage.removeItem(this.storagePrefix + chatId);
  }

  restorePosition(chatId: number) {
    console.log('restoring position');
    const scrollTop = this.get(chatId);
    if (!this.chatContainer) return;
    const nativeElement = this.chatContainer.nativeElement;
    const scrollHeight = nativeElement.scrollHeight;

    console.log(`[DEBUG] at the end of scroll: ${this.atTheEndOfScroll}`);
    if (this.atTheEndOfScroll) {
      nativeElement.scrollTop = scrollHeight;
      return;
    }

    console.log('[Chat Scroll Service] scrollHeight: ' + scrollHeight);
    if (!scrollTop) {
      nativeElement.scrollTop = scrollHeight;
      this.atTheEndOfScroll = true;
    } else {
      this.chatContainer.nativeElement.scrollTop = scrollTop;
      this.atTheEndOfScroll = false;
    }
  }

  checkTheEndOfScroll(chatId: number) {

    if (!this.chatContainer) return;
    const nativeElement = this.chatContainer.nativeElement;
    const scrollTop = nativeElement.scrollTop;
    const clientHeight = nativeElement.clientHeight;
    const scrollHeight = nativeElement.scrollHeight;

    const difference = Math.abs(scrollTop + clientHeight - scrollHeight);
    if (difference < 100 && difference >= 0 ) {
      this.atTheEndOfScroll = true;
    } else this.atTheEndOfScroll = false;
    setTimeout(() => this.save(chatId), 2000);
  }
}
