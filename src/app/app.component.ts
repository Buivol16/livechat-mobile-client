import { Component } from '@angular/core';
import { IonRouterOutlet, IonApp } from '@ionic/angular';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-root',
  imports: [IonRouterOutlet, IonApp],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'livechat-browser-client';

  constructor(){
    addIcons({
      'chats': 'img/chats.svg',
      'home': 'img/home.svg',
      'settings': 'img/settings.svg',
      'calls': 'img/calls.svg',
    });
  }
}
