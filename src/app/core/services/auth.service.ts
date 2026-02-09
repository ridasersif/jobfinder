import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User, UserSession } from '../../shared/models/user.model';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

 // Register avec mot de passe hashé
  register(user: User): Observable<User> {
    const salt = bcrypt.genSaltSync(10); // génère le sel
    const hashedPassword = bcrypt.hashSync(user.password, salt); // hash le mot de passe

    const userToSave = { ...user, password: hashedPassword };

    return this.http.post<User>(this.apiUrl, userToSave);
  }

  // Login retourne un UserSession (sans password)
  login(email: string, password: string): Observable<UserSession | null> {
  return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
    map(users => {
      if (users.length > 0) {
        const user = users[0];
        // comparer mot de passe
        const valid = bcrypt.compareSync(password, user.password);
        if (valid) {
          const { password, ...userSansPassword } = user;
          localStorage.setItem('user', JSON.stringify(userSansPassword));
          return userSansPassword as UserSession; // <-- type correct
        }
      }
      return null;
    })
  );
}



  logout(): void {
    localStorage.removeItem('user');
  }

  getCurrentUser(): UserSession | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
