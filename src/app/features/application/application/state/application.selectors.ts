import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ApplicationState } from './application.state';

export const selectApplicationState = createFeatureSelector<ApplicationState>('applications');

export const selectAllApplications = createSelector(
  selectApplicationState,
  (state) => state.applications
);

export const selectApplicationLoading = createSelector(
  selectApplicationState,
  (state) => state.loading
);

export const selectApplicationError = createSelector(
  selectApplicationState,
  (state) => state.error
);

export const selectApplicationsByStatus = (status: 'pending' | 'accepted' | 'rejected') => createSelector(
  selectAllApplications,
  (applications) => applications.filter(app => app.status === status)
);
