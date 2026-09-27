import { Component, input } from "@angular/core";

@Component({
    selector: "app-chatprofileimage",
    templateUrl: "./chatprofileimage.component.html",
    styleUrl: "./chatprofileimage.component.css",
    standalone: true,
    imports: []
})
export class ChatProfileImageComponent{
    readonly isMe = input(false);
    readonly profileImage = input.required<string>();
}