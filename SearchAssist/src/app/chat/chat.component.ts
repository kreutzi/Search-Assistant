import { Component, OnInit } from "@angular/core";
import { ChatService } from "../chat.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrl: "./chat.component.css",
})
export class ChatComponent implements OnInit {
  // @ts-ignore
  messages: ChatMessage[] = [];
  userInput: string = "";

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.messages.push({
      content: "Welcome to GemAssist! How can I help you today?",
      isUser: false,
    });
  }

  sendMessage() {
    if (this.userInput.trim() === "") return;

    // Add user message to the chat
    this.messages.push({ content: this.userInput, isUser: true });

    // Call the backend service
    this.chatService.getResponse(this.userInput).subscribe(
      (response) => {
        this.messages.push({ content: response, isUser: false });
      },
      (error) => {
        this.messages.push({
          content: "Sorry, there was an error processing your request.",
          isUser: false,
        });
      },
    );

    // Clear the input field
    this.userInput = "";
  }
}
