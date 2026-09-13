import { Component } from '@angular/core';
import { IonRouterOutlet, IonApp } from '@ionic/angular';

@Component({
  selector: 'app-root',
  imports: [IonRouterOutlet, IonApp],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'livechat-browser-client';
}
