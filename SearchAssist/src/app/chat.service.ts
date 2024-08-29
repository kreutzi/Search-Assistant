// chat.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private apiUrl = "http://localhost:3000/chat"; // Update this if your backend is hosted elsewhere

  constructor(private http: HttpClient) { }

  getResponse(message: string): Observable<string> {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") ?? "null",
    ).token;
    return this.http
      .post<{ reply: string }>(this.apiUrl, { message, currentUser })
      .pipe(map((response) => response.reply));
  }
}
