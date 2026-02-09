import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  isLoading = false;

  validationMessages: Record<string, Record<string, string>> = {
  firstName: {
    required: 'Veuillez saisir votre prénom.'
  },
  lastName: {
    required: 'Veuillez saisir votre nom.'
  },
  email: {
    required: 'Veuillez saisir votre adresse e-mail.',
    email: 'Veuillez saisir une adresse e-mail valide.'
  },
  password: {
    required: 'Veuillez saisir votre mot de passe.',
    minlength: 'Votre mot de passe doit contenir au moins 6 caractères.'
  }
};


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService

  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

 getError(controlName: string): string | null {
    const control = this.registerForm.get(controlName);
    if (!control?.errors) return null;

    const firstError = Object.keys(control.errors)[0];
    return this.validationMessages?.[controlName]?.[firstError] ?? null;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.authService.register(this.registerForm.value)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.show('Inscription réussie ✅', 'success');
        this.router.navigate(['/login']);

      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.toastService.show('Erreur lors de l’inscription ❌', 'error');
        this.errorMessage = 'Une erreur est survenue lors de l\'inscription.';
      }
    });
  }
}
