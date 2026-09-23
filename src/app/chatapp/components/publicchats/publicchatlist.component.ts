import { Component, inject, signal, WritableSignal } from "@angular/core";
import { ChatComponent } from "../chat/chat.component";
import { Chat } from "../../models/chat.models";
import { ChatService } from "../../services/chat/chatservice";
import { IonItem } from "@ionic/angular";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-public-chat-list",
    templateUrl: "./publicchatlist.component.html",
    styleUrl: "./publicchatlist.component.css",
    imports: [ChatComponent, IonItem, RouterLink]
})
export class PublicChatListComponent{
    readonly chatService = inject(ChatService);
    readonly chats : WritableSignal<Chat[]> = signal([]);

    constructor(){
        this.getAndMapChats();
    }

    getAndMapChats(){
        const result = this.chatService.getPublicChats();
        result.subscribe((objs) => {
            this.chats?.update(chats => {
                chats = objs.map((object) => ({
                    ...object,
                    members: [],
                    messages: [],
                }));
                return chats;
            });
        });
    }

    getNowDate(chat: Chat){
        if(chat.messages.length > 0){
            return chat.messages[chat.messages.length-1].createdAt;
        }else{
            return null;
        }
    }

    getLastMessageContent(chat: Chat){
        return (chat.messages[chat.messages.length-1] && chat.messages[chat.messages.length-1].encryptedMessage) ?? '';
    }
}
