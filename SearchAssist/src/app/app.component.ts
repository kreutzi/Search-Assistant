import { Component, OnInit } from "@angular/core";
import { ChildrenOutletContexts } from "@angular/router";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  constructor(
    private contexts: ChildrenOutletContexts,
    public authService: AuthService,
  ) { }
  getRouteAnimationData() {
    return this.contexts.getContext("primary")?.route?.snapshot?.data?.[
      "animation"
    ];
  }
  title = "gemassist";

  ngOnInit(): void {
    this.authService.isloggedin();
  }
}
