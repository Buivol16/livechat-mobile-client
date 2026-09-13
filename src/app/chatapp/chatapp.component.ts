import { Component } from '@angular/core';
import { MenuComponent } from './components/menu/menu.component';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-chat-app',
  templateUrl: './chatapp.component.html',
  styleUrl: './chatapp.component.css',
  standalone: true,
  imports: [MenuComponent, IonRouterOutlet]
})
export class ChatAppComponent {
}
