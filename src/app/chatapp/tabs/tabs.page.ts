import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular';

@Component({
  templateUrl: './tabs.page.html',
  styleUrl: './tabs.page.css',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon],
})
export class Tabs {}
