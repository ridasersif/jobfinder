import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApplicationService } from "../../service/application.service";
import { Injectable } from '@angular/core';
import * as ApplicationActions from "./applications.actions"
import { catchError, map, mergeMap, of, tap } from 'rxjs';



@Injectable()
export class ApplicationsEffects {

  constructor(
    private applicationService: ApplicationService,
    private actions$: Actions
  ) { }


  addApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationActions.addApplication),
      mergeMap(({ application }) =>
        this.applicationService.addApplication(application).pipe(
          map((savedApplication) =>
            ApplicationActions.addApplicationSuccess({
              application: savedApplication
            })
          ),
          catchError(error =>
            of(
              ApplicationActions.addApplicationFailure({
                error: error.message || 'Something went wrong'
              })
            )
          )
        )
      )
    )
  );

  loadApplications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationActions.loadApplications),
      mergeMap(({ userId }) =>
        this.applicationService.getApplicationsByUserId(userId.toString()).pipe(
          map((applications) =>
            ApplicationActions.loadApplicationsSuccess({
              applications
            })
          ),
          catchError(error =>
            of(
              ApplicationActions.loadApplicationsFailure({
                error: error.message || 'Error loading applications'
              })
            )
          )
        )
      )
    )
  );

  changeApplicationStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationActions.changeApplicationStatus),
      mergeMap(({ id, status }) =>
        this.applicationService.updateApplicationStatus(id, status).pipe(
          map((application) =>
            ApplicationActions.changeApplicationStatusSuccess({
              application
            })
          ),
          catchError(error =>
            of(
              ApplicationActions.changeApplicationStatusFailure({
                error: error.message || 'Error updating status'
              })
            )
          )
        )
      )
    )
  );

  deleteApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationActions.deleteApplication),
      mergeMap(({ id }) =>
        this.applicationService.deleteApplication(id).pipe(
          map(() =>
            ApplicationActions.deleteApplicationSuccess({
              id
            })
          ),
          catchError(error =>
            of(
              ApplicationActions.deleteApplicationFailure({
                error: error.message || 'Error deleting application'
              })
            )
          )
        )
      )
    )
  );

}
