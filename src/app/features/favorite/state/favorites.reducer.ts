import { createReducer, on } from '@ngrx/store';
import { FavoritesState } from './favorites.state';
import * as FavoritesActions from './favorites.actions';


export const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null
};


export const favoritesReducer = createReducer(

  initialState,

  // LOAD FAVORITES
  on(FavoritesActions.loadFavorites, (state) => ({
    ...state,
    loading: true
  })),

  on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => {
    console.log('Reducer: loadFavoritesSuccess, favorites =', favorites);
  return{
    ...state,
    favorites: favorites,
    loading: false
  }
}),

  on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),



  // ADD FAVORITE
  on(FavoritesActions.addFavorite, (state) => ({
    ...state,
    loading: true
  })),

  on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({
    ...state,
    favorites: [...state.favorites, favorite],
    loading: false
  })),

  on(FavoritesActions.addFavoriteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),



  // DELETE FAVORITE
  on(FavoritesActions.deleteFavorite, (state) => ({
    ...state,
    loading: true
  })),

  on(FavoritesActions.deleteFavoriteSuccess, (state, { id }) => ({
    ...state,
    favorites: state.favorites.filter(f => f.id !== id),
    loading: false
  })),

  on(FavoritesActions.deleteFavoriteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))

);
