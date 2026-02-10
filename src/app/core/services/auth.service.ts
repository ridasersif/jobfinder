import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User, UserSession } from '../../shared/models/user.model';
import * as bcrypt from 'bcryptjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

   private loggedInSubject = new BehaviorSubject<boolean>(false);
   public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(
  private http: HttpClient,
  @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      this.loggedInSubject.next(!!user);
    }
  }

  public get isLoggedInValue(): boolean {
    return this.loggedInSubject.getValue();
  }

  private setStorage(key: string, value: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }




  register(user: User): Observable<User> {

        console.log(this.loggedInSubject.value);
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);

    const userToSave = { ...user, password: hashedPassword };

    this.setStorage('user', userToSave);
    this.loggedInSubject.next(true);
    console.log(this.isLoggedIn$);
    console.log("________________________________________");
    console.log(this.loggedInSubject.value);
    return this.http.post<User>(this.apiUrl, userToSave);

  }


  login(email: string, password: string): Observable<UserSession | null> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];

          const valid = bcrypt.compareSync(password, user.password);
          if (valid) {
            const { password, ...userSansPassword } = user;
            this.setStorage('user', userSansPassword);
            this.loggedInSubject.next(true);
            return userSansPassword as UserSession;
          }
        }
        return null;
      })
    );
  }



  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
    }
    this.loggedInSubject.next(false);
  }

  // Récupérer l'utilisateur courant
  getCurrentUser(): UserSession | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }




}
