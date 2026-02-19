import { createReducer, on } from "@ngrx/store";
import { initialApplicationState } from "./application.state";
import * as ApplicationAction from "./applications.actions"

export const applicationReducer = createReducer(
  initialApplicationState,

  //=====================ADD======================
  on(ApplicationAction.addApplication, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ApplicationAction.addApplicationSuccess, (state, { application }) => ({
    ...state,
    loading: false,
    applications: [...state.applications, application]
  })),

  on(ApplicationAction.addApplicationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  //=====================LOAD======================
  on(ApplicationAction.loadApplications, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ApplicationAction.loadApplicationsSuccess, (state, { applications }) => ({
    ...state,
    loading: false,
    applications
  })),

  on(ApplicationAction.loadApplicationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  //=====================STATUS======================
  on(ApplicationAction.changeApplicationStatus, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ApplicationAction.changeApplicationStatusSuccess, (state, { application }) => ({
    ...state,
    loading: false,
    applications: state.applications.map(app => app.id === application.id ? application : app)
  })),

  on(ApplicationAction.changeApplicationStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  //=====================DELETE======================
  on(ApplicationAction.deleteApplication, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ApplicationAction.deleteApplicationSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    applications: state.applications.filter(app => app.id !== id.toString())
  })),

  on(ApplicationAction.deleteApplicationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
