import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, throwError } from 'rxjs';
import { User, UserSession } from '../../../shared/models/user.model';
import * as bcrypt from 'bcryptjs';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private apiUrl = 'http://localhost:3000/users';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    /**
     * Updates user profile information (firstName, lastName, email).
     */
    updateProfile(user: UserSession): Observable<UserSession> {
        return this.http.get<User[]>(`${this.apiUrl}?id=${user.id}`).pipe(
            map(users => {
                if (users.length === 0) {
                    throw new Error('Utilisateur non trouvé');
                }
                return users[0];
            }),
            switchMap(fullUser => {
                const updatedUser = { ...fullUser, ...user };
                return this.http.put<User>(`${this.apiUrl}/${user.id}`, updatedUser);
            }),
            map(savedUser => {
                const { password, ...userSession } = savedUser;
                this.authService.updateUserSession(userSession);
                return userSession;
            })
        );
    }

    changePassword(userId: number, currentPassword: string, newPassword: string): Observable<boolean> {
        return this.http.get<User[]>(`${this.apiUrl}?id=${userId}`).pipe(
            map(users => {
                if (users.length === 0) throw new Error('Utilisateur non trouvé');
                const user = users[0];

                // Verify old password
                const isValid = bcrypt.compareSync(currentPassword, user.password);
                if (!isValid) {
                    throw new Error('Mot de passe actuel incorrect');
                }

                return user;
            }),
            switchMap(user => {
                // Hash new password
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(newPassword, salt);
                const updatedUser = { ...user, password: hashedPassword };

                return this.http.put<User>(`${this.apiUrl}/${userId}`, updatedUser);
            }),
            map(() => true)
        );
    }
}
