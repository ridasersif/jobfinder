import { Application } from "../../models/application.model";

export interface ApplicationState {
  applications: Application[];
  loading: boolean;
  error: string | null;
}

export const initialApplicationState: ApplicationState = {
  applications: [],
  loading: false,
  error: null
};
