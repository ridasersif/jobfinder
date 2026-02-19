import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { Application } from '../models/application.model';
import * as ApplicationActions from './state/applications.actions';
import * as ApplicationSelectors from './state/application.selectors';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, DragDropModule, LucideAngularModule, RouterModule],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent implements OnInit, OnDestroy {
  pending: Application[] = [];
  accepted: Application[] = [];
  rejected: Application[] = [];

  showDeleteModal = false;
  applicationIdToDelete: string | undefined = undefined;

  loading$ = this.store.select(ApplicationSelectors.selectApplicationLoading);
  error$ = this.store.select(ApplicationSelectors.selectApplicationError);

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.store.dispatch(ApplicationActions.loadApplications({ userId: user.id }));
    }

    this.store.select(ApplicationSelectors.selectAllApplications)
      .pipe(takeUntil(this.destroy$))
      .subscribe(applications => {
        this.pending = applications.filter(app => app.status === 'pending');
        this.accepted = applications.filter(app => app.status === 'accepted');
        this.rejected = applications.filter(app => app.status === 'rejected');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  drop(event: CdkDragDrop<Application[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const application = event.previousContainer.data[event.previousIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);

      if (application.id) {
        this.store.dispatch(ApplicationActions.changeApplicationStatus({
          id: application.id,
          status: newStatus
        }));
      }

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  removeApplication(id: string | undefined): void {
    if (id) {
      this.applicationIdToDelete = id;
      this.showDeleteModal = true;
    }
  }

  confirmDelete(): void {
    if (this.applicationIdToDelete) {
      this.store.dispatch(ApplicationActions.deleteApplication({ id: this.applicationIdToDelete }));
      this.cancelDelete();
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.applicationIdToDelete = undefined;
  }

  private getStatusFromContainerId(id: string): 'pending' | 'accepted' | 'rejected' {
    switch (id) {
      case 'cdk-drop-list-pending': return 'pending';
      case 'cdk-drop-list-accepted': return 'accepted';
      case 'cdk-drop-list-rejected': return 'rejected';
      default: return 'pending';
    }
  }
}
