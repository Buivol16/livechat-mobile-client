import { Component, computed, inject } from '@angular/core';
import KeycloakService from '../../services/keycloak/keycloakservice';
import { IonContent, IonList, IonRouterLink } from '@ionic/angular';
import { ChatService } from '../../services/chat/chatservice';
import { PrivateChatListComponent } from '../privatechats/privatechatlist.component';
import { PublicChatListComponent } from '../publicchats/publicchatlist.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  imports: [IonContent, IonList, PrivateChatListComponent, PublicChatListComponent, IonRouterLink, RouterLink],
})
export class MenuComponent {
  private readonly keycloakService = inject(KeycloakService);
  private readonly chatService = inject(ChatService);

  protected readonly privateChats = computed(() => this.chatService.getPrivateChats());

  logout(event: Event) {
    event.preventDefault();
    console.log('Trying to logout...');
    this.keycloakService.logout();
  }

  login(event: Event) {
    event.preventDefault();
    console.log('Trying to log in...');
    this.keycloakService.login();
  }
}
