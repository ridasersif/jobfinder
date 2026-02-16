import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApplicationService } from "../../service/application.service";
import { Injectable } from '@angular/core';
import * as ApplicationActions from "./applications.actions"
import { catchError, map, mergeMap, of, tap } from 'rxjs';



@Injectable()
export class ApplicationsEffects {

  constructor(
    private applicationService:ApplicationService,
    private actions$:Actions
  ){}


  //==============ADD APPLICATION========================

  addApplication$= createEffect(()=>
    this.actions$.pipe(
      ofType(ApplicationActions.addApplication),
      tap(action => console.log("✅ EFFECT RECEIVED ACTION:", action)),
      mergeMap(({application }) =>
        this.applicationService.addApplication(application).pipe(

           tap(res => console.log("✅ HTTP RESPONSE:", res)),
          map((savedApplication) =>
            ApplicationActions.addApplicationSuccess({
              application:savedApplication
            })
          ),
         catchError(error => {
            console.log("❌ EFFECT ERROR:", error);
            return of(
              ApplicationActions.addApplicationFailure({
                error: error.message || 'Something went wrong'
              })
            );
          })
        )
      )
    )
  )

}
