import { Component, input } from '@angular/core';
import { IonInput, IonTextarea } from '@ionic/angular';

@Component({
  imports: [IonInput, IonTextarea],
  styleUrl: './profileinput.component.css',
  templateUrl: './profileinput.component.html',
  selector: 'app-profile-input',
})
export class ProfileInput{

  label = input.required<string>();
  placeholder = input.required<string>();
  type = input<string>();
}
