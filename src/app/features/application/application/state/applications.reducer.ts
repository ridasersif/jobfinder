import { createReducer, on } from "@ngrx/store";
import { initialApplicationState } from "./application.state";
import * as ApplicationAction from "./applications.actions"

export const applicationReducer = createReducer(
  initialApplicationState,

  //=====================ADD======================
  on(ApplicationAction.addApplication, (state)=>({
    ...state,
    loading: true,
    error: null
  })),

  on(ApplicationAction.addApplicationSuccess, (state,{application})=>({
    ...state,
    loading: false,
    applications: [...state.applications,application]
  })),

  on(ApplicationAction.addApplicationFailure, (state, {error})=>({
    ...state,
    loading:false,
    error
  }))




)
