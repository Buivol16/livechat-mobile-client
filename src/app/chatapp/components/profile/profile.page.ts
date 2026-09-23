import { Component } from "@angular/core";
import { IonContent, IonBackButton, IonButton, IonText, IonAvatar, IonNavLink } from "@ionic/angular";
import { ProfileInput } from "./profileinput/profileinput.component";

@Component({
  standalone: true,
  imports: [
    IonContent,
    IonBackButton,
    IonButton,
    IonText,
    IonAvatar,
    ProfileInput,
    IonNavLink
],
  styleUrl: './profile.page.css',
  templateUrl: './profile.page.html',
})
export class Profile {
}
