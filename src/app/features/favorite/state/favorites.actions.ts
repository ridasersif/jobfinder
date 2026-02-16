import { createAction, props } from "@ngrx/store";
import { Favorite } from "../models/favorite.model";


// LOAD FAVORITES
export const loadFavorites = createAction(
  '[Favorites] Load Favorites',
  props<{ userId: number }>()
)

export const loadFavoritesSuccess = createAction(
  '[Favorites] Load Favorites Success',
  props<{ favorites: Favorite[] }>(),
)

export const loadFavoritesFailure = createAction(
  '[Favorites] Load Favorites Failure',
  props<{ error: string }>()
)

// ADD FAVORITE
export const addFavorite = createAction(
  '[Favorites] Add Favorite',
  props<{ favorite: Favorite }>()
)

export const addFavoriteSuccess = createAction(
  '[Favorites] Add Favorite Success',
  props<{ favorite: Favorite }>()
)

export const addFavoriteFailure = createAction(
  '[Favorites] Add Favorite Failure',
  props<{ error: string }>()
)

// DELETE FAVORITE
export const deleteFavorite = createAction(
  '[Favorites] Delete Favorite',
  props<{id: number}>()
)

export const deleteFavoriteSuccess = createAction(
  '[Favorites] Delete Favorite Success',
  props<{id: number}>()
)

export const deleteFavoriteFailure = createAction(
  '[Favorites] Delete Favorite Failure',
  props<{error: string}>()
)
