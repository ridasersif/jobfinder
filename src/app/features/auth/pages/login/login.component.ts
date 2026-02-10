import { routes } from './../../../../app.routes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { FormValidationService } from '../../../../shared/services/form-validation.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  returnUrl = '/home';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private formValidation: FormValidationService,
    private route: ActivatedRoute
  ) { }

  validationMessages: Record<string, Record<string, string>> = {
    email: {
      required: 'Veuillez saisir votre adresse e-mail.',
      email: 'Veuillez saisir une adresse e-mail valide.'
    },
    password: {
      required: 'Veuillez saisir votre mot de passe.',
      minlength: 'Votre mot de passe doit contenir au moins 6 caractères.'
    }
  };

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

   getError(controlName: string): string | null {
    return this.formValidation.getError(
      this.loginForm,
      controlName,
      this.validationMessages);
    }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user) {

          this.toastService.show('Connexion réussie ! 👋', 'success');
          this.router.navigate([this.returnUrl]);
        } else {
          this.errorMessage = 'Email ou mot de passe incorrect';
          this.toastService.show('Identifiants incorrects ❌', 'error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
        this.toastService.show('Erreur de connexion ❌', 'error');
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register'], { queryParams: { returnUrl: this.returnUrl } });
  }
}
