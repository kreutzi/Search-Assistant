// app.module.ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { SignupComponent } from "./signup/signup.component";
import { ChatComponent } from "./chat/chat.component";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { HttpClientModule } from "@angular/common/http";
import { MarkdownModule } from "ngx-markdown";

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		AboutComponent,
		SignupComponent,
		ChatComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		HttpClientModule,
		MarkdownModule.forRoot(),
	],
	providers: [provideAnimationsAsync()],
	bootstrap: [AppComponent],
})
export class AppModule {}
