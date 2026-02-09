import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Toast, ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-4" style="z-index: 2100;">
      <div *ngFor="let t of toasts; let i = index"
           [@slideIn]
           [ngClass]="getToastClass(t.type)"
           class="toast-glass d-flex align-items-center p-3 mb-3">

        <div class="toast-icon-box me-3">
          <i [class]="getIconClass(t.type)"></i>
        </div>

        <div class="flex-grow-1 overflow-hidden">
          <p class="mb-0 toast-text text-truncate">{{ t.message }}</p>
        </div>

        <button type="button" class="btn-close-custom ms-3" (click)="removeToast(i)">
          <i class="bi bi-x"></i>
        </button>

        <div class="toast-timer">
          <div class="timer-inner" [style.background-color]="getTimerColor(t.type)"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      pointer-events: none;
    }

    .toast-glass {
      pointer-events: auto;
      min-width: 320px;
      max-width: 420px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.05),
        0 4px 6px -2px rgba(0, 0, 0, 0.02),
        inset 0 0 0 1px rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
    }

    .toast-icon-box {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .toast-success .toast-icon-box { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .toast-error .toast-icon-box { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

    .toast-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1e293b;
    }

    .btn-close-custom {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1.2rem;
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
      &:hover { color: #475569; }
    }

    .toast-timer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: rgba(0, 0, 0, 0.03);
    }

    .timer-inner {
      height: 100%;
      width: 100%;
      transform-origin: left;
      animation: timer 3s linear forwards;
    }

    @keyframes timer {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }
  `],
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
