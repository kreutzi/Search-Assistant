import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Router } from "@angular/router";

interface User {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private apiUrl = "http://localhost:3000/auth"; // Adjust the base URL as needed

  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user).pipe(
      tap((response) => {
        // Handle successful registration (e.g., store user data, redirect)
      }),
      catchError((error) => {
        throw error; // Rethrow the error for handling in the component
      }),
    );
  }

  isLoggedIn = false;

  login(email: string, password: string): Observable<User> {
    const existingUser = { email, password };
    return this.http.post<User>(`${this.apiUrl}/login`, existingUser).pipe(
      tap((user) => {
        this.setCurrentUser(user);
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    this.router.navigateByUrl("/");
  }

  isloggedin(): void {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") ?? "null",
    );
    if (currentUser) {
      var token = currentUser.token; // your token

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .get("http://localhost:3000/auth/profile", { headers })
        .subscribe({
          next: (response) => {
            // Handle the successful response (e.g., display a success message, update the UI)
            this.isLoggedIn = true;
          },
          error: (_) => {
            localStorage.removeItem("currentUser");
            // Handle errors (e.g., display an error message)
          },
        });
    }
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem("currentUser", JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
