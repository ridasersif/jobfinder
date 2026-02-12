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
    switch (type) {
      case 'success': return 'toast-success';
      case 'error': return 'toast-error';
      case 'info': return 'toast-info';
      case 'warning': return 'toast-warning';
      default: return 'toast-success';
    }
  }


 getIconClass(type: string): string {
    switch(type) {
      case 'success': return 'bi bi-check2-circle';
      case 'error': return 'bi bi-exclamation-triangle';
      case 'info': return 'bi bi-info-circle';
      case 'warning': return 'bi bi-exclamation-circle';
      default: return 'bi bi-info-circle';
    }
  }


  getTimerColor(type: string): string {
  switch(type) {
    case 'success': return '#10b981';
    case 'error': return '#ef4444';
    case 'info': return '#3b82f6';
    case 'warning': return '#f59e0b';  
    default: return '#3b82f6';
  }
}

}
