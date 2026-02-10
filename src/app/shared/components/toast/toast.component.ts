import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Toast, ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px) scale(0.95)', opacity: 0 }),
        animate('0.4s cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateY(0) scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s cubic-bezier(0.7, 0, 0.84, 0)', style({ transform: 'translateX(20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.toastState.subscribe(t => {
      this.toasts.push(t);
      setTimeout(() => {
        const index = this.toasts.indexOf(t);
        if (index > -1) {
          this.removeToast(index);
        }
      }, 3000);
    });
  }

  removeToast(index: number) {
    if (index > -1) {
      this.toasts.splice(index, 1);
    }
  }

  getToastClass(type: string): string {
    return type === 'success' ? 'toast-success' : 'toast-error';
  }

  getIconClass(type: string): string {
    return type === 'success' ? 'bi bi-check2-circle' : 'bi bi-exclamation-triangle';
  }

  getTimerColor(type: string): string {
    return type === 'success' ? '#10b981' : '#ef4444';
  }
}
