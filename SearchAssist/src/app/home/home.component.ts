import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void { }

  goToChat() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["/chat"]);
    } else {
      alert("Please log in to access the chat.");
      this.router.navigate(["/signup"]);
    }
  }
}
