import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service"; // Adjust the path if needed
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrl: "./signup.component.css",
})
export class SignupComponent implements OnInit {
  // @ts-ignore
  authForm: FormGroup;

  isLoginMode = true;
  errorMessage: string = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router, // For redirecting after login/signup
  ) { }

  ngOnInit() {
    this.initForm();
    this.authService.isLoggedIn ? this.router.navigate(["/"]) : null;
  }

  initForm() {
    this.authForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });

    if (!this.isLoginMode) {
      this.authForm.addControl(
        "firstName",
        this.fb.control("", Validators.required),
      );
      this.authForm.addControl(
        "lastName",
        this.fb.control("", Validators.required),
      );
      this.authForm.addControl(
        "userName",
        this.fb.control("", Validators.required),
      );
    }
  }

  onSubmit() {
    if (this.authForm.valid) {
      if (!this.isLoginMode) {
        // Registration
        this.authService.register(this.authForm.value).subscribe({
          next: (user) => {
            // Optional: Display a success message or redirect
            this.router.navigate(["/login"]); // Example redirect
          },
          error: (error) => {
            this.errorMessage = error.error.message || "Registration failed.";
          },
        });
      } else {
        // Login
        this.authService
          .login(this.authForm.value.email, this.authForm.value.password)
          .subscribe({
            next: (user) => {
              this.authService.isLoggedIn = true;
              // Optional: Redirect to a protected route
              this.router.navigate(["/"]); // Example redirect
            },
            error: (error) => {
              this.errorMessage = error.error.message || "Login failed.";
            },
          });
      }
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.initForm(); // Reset and adjust the form
  }
}
