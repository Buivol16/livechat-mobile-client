import { Component } from '@angular/core';
import {
  IonContent,
  IonText,
  IonToggle,
  IonButton,
  IonModal,
  IonIcon,
} from '@ionic/angular';
import { ModalOpenerButton } from './modalopenerbutton/modalopenerbutton.component';

@Component({
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css',
  imports: [
    IonContent,
    IonText,
    IonToggle,
    ModalOpenerButton,
    IonButton,
    IonModal,
    IonIcon,
  ],
})
export class Settings {}
