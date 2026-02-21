import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from './services/profile.service';
import { ToastService } from '../../core/services/toast.service';
import { UserSession } from '../../shared/models/user.model';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, RouterLink]
})
export class ProfileComponent implements OnInit {
    activeTab: 'info' | 'security' = 'info';
    currentUser: UserSession | null = null;

    profileForm: FormGroup;
    passwordForm: FormGroup;
    isLoading = false;

    constructor(
        private authService: AuthService,
        private profileService: ProfileService,
        private fb: FormBuilder,
        private toastService: ToastService,
        private router: Router
    ) {
        this.profileForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        this.currentUser = this.authService.getCurrentUser();
        if (this.currentUser) {
            this.profileForm.patchValue({
                firstName: this.currentUser.firstName,
                lastName: this.currentUser.lastName,
                email: this.currentUser.email
            });
        } else {
            this.router.navigate(['/login']);
        }
    }

    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        return newPassword === confirmPassword ? null : { mismatch: true };
    }

    setActiveTab(tab: 'info' | 'security') {
        this.activeTab = tab;
    }

    onUpdateProfile() {
        if (this.profileForm.invalid) return;

        this.isLoading = true;
        const updatedData = { ...this.currentUser, ...this.profileForm.value };

        this.profileService.updateProfile(updatedData).subscribe({
            next: (user) => {
                this.currentUser = user; // Update local state
                this.toastService.show('Profil mis à jour avec succès');
                this.isLoading = false;
            },
            error: (err) => {
                this.toastService.show('Erreur lors de la mise à jour du profil', 'error');
                this.isLoading = false;
                console.error(err);
            }
        });
    }

    onChangePassword() {
        if (this.passwordForm.invalid) return;

        this.isLoading = true;
        const { currentPassword, newPassword } = this.passwordForm.value;

        if (!this.currentUser || !this.currentUser.id) return;

        this.profileService.changePassword(this.currentUser.id, currentPassword, newPassword).subscribe({
            next: () => {
                this.toastService.show('Mot de passe modifié avec succès');
                this.passwordForm.reset();
                this.isLoading = false;
            },
            error: (err) => {
                this.toastService.show(err.message || 'Erreur lors du changement de mot de passe', 'error');
                this.isLoading = false;
            }
        });
    }
}
