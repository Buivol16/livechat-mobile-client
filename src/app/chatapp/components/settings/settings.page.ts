import { Component } from "@angular/core";
import { IonContent, IonText, IonToggle, IonButton } from "@ionic/angular";
import { ModalOpenerButton } from "./modalopenerbutton/modalopenerbutton.component";

@Component({
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css',
  imports: [IonContent, IonText, IonToggle, ModalOpenerButton, IonButton],
})
export class Settings {}
