import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  getError(
    form: FormGroup,
    controlName: string,
    messages: Record<string, Record<string, string>>
  ): string | null {

    const control = form.get(controlName);
    if (!control || !control.errors) return null;

    const firstError = Object.keys(control.errors)[0];
    return messages?.[controlName]?.[firstError] ?? null;
  }

}
