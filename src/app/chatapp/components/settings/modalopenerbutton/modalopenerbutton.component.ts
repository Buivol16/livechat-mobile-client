import { Component, input } from "@angular/core";
import { IonText, IonButton } from "@ionic/angular";

@Component({
  imports: [IonText, IonButton],
  selector: 'app-modal-opener-button',
  templateUrl: './modalopenerbutton.component.html',
  styleUrl: './modalopenerbutton.component.css',
})
export class ModalOpenerButton{
  label = input.required<string>();
  option = input.required<string>();
}
