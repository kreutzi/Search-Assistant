import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrl: "./about.component.css",
})
export class AboutComponent {
  constructor(private router: Router) { }

  navigateToSignup() {
    this.router.navigate(["/signup"]);
  }
}
