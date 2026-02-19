import { createAction, props } from "@ngrx/store";
import { Application } from "../../models/application.model";


// ================= LOAD ALL APPLICATIONS =================

export const loadApplications = createAction(
  '[Applications] Load Applications',
  props<{ userId: number }>()
);

export const loadApplicationsSuccess = createAction(
  '[Applications] Load Applications Success',
  props<{ applications: Application[] }>()
);

export const loadApplicationsFailure = createAction(
  '[Applications] Load Applications Failure',
  props<{ error: string }>()
);

// ================= LOAD APPLICATION BY ID =================

export const loadApplicationById = createAction(
  '[Applications] Load Application By ID',
  props<{ id: number }>()
);

export const loadApplicationByIdSuccess = createAction(
  '[Applications] Load Application By ID Success',
  props<{ application: Application }>()
);

export const loadApplicationByIdFailure = createAction(
  '[Applications] Load Application By ID Failure',
  props<{ error: string }>()
);

// ================= ADD APPLICATION =================

export const addApplication = createAction(
  '[Applications] Add Application',
  props<{ application: Application }>()
);

export const addApplicationSuccess = createAction(
  '[Applications] Add Application Success',
  props<{ application: Application }>()
);

export const addApplicationFailure = createAction(
  '[Applications] Add Application Failure',
  props<{ error: string }>()
);

// ================= CHANGE APPLICATION STATUS =================

export const changeApplicationStatus = createAction(
  '[Applications] Change Status',
  props<{ id: string; status: 'pending' | 'accepted' | 'rejected' }>()
);

export const changeApplicationStatusSuccess = createAction(
  '[Applications] Change Status Success',
  props<{ application: Application }>()
);

export const changeApplicationStatusFailure = createAction(
  '[Applications] Change Status Failure',
  props<{ error: string }>()
);

// ================= DELETE APPLICATION =================

export const deleteApplication = createAction(
  '[Applications] Delete Application',
  props<{ id: string }>()
);

export const deleteApplicationSuccess = createAction(
  '[Applications] Delete Application Success',
  props<{ id: string }>()
);

export const deleteApplicationFailure = createAction(
  '[Applications] Delete Application Failure',
  props<{ error: string }>()
);

// ================= FILTER APPLICATIONS BY STATUS =================

export const filterApplicationsByStatus = createAction(
  '[Applications] Filter Applications By Status',
  props<{ status: string }>()
);

export const filterApplicationsByStatusSuccess = createAction(
  '[Applications] Filter Applications By Status Success',
  props<{ applications: Application[] }>()
);

export const filterApplicationsByStatusFailure = createAction(
  '[Applications] Filter Applications By Status Failure',
  props<{ error: string }>()
);
