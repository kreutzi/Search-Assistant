import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { SignupComponent } from "./signup/signup.component";
import { ChatComponent } from "./chat/chat.component";

const routes: Routes = [
	{ path: "", component: HomeComponent, data: { animation: "openClosePage" } },
	{ path: "about", component: AboutComponent },
	{ path: "signup", component: SignupComponent },
	{ path: "chat", component: ChatComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
