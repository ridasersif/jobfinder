import { ToastService } from './../../../core/services/toast.service';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FavoriteService } from "../services/favorites.service";
import * as FavoritesActions from './favorites.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from "rxjs";
import { AuthService } from "../../../core/services/auth.service";

@Injectable()
export class FavoritesEffects {

  constructor(
    private actions$: Actions,
    private favoritesService: FavoriteService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  private getCurrentUserId(): number | null {
    const user = this.authService.getCurrentUser();
    return user?.id ?? null;
  }

  // ================= LOAD FAVORITES =================
  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.loadFavorites),
      switchMap(() => {

        if (!this.authService.isLoggedInValue) {
          return of(FavoritesActions.loadFavoritesFailure({
            error: 'Utilisateur non connecté'
          }));
        }

        const userId = this.getCurrentUserId();
        if (!userId) {
          return of(FavoritesActions.loadFavoritesFailure({
            error: 'Utilisateur non trouvé'
          }));
        }

        return this.favoritesService.getFavoritesByUserId(userId).pipe(
          map(favorites =>
            FavoritesActions.loadFavoritesSuccess({ favorites })
          ),
          catchError(error =>
            of(FavoritesActions.loadFavoritesFailure({
              error: 'Erreur lors de la vérification des favoris.'
            }))
          )
        );
      })
    )
  );

  // ================= ADD FAVORITE (WITH DUPLICATE CHECK) =================
  addFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.addFavorite),
      mergeMap(action => {

        if (!this.authService.isLoggedInValue) {
          return of(FavoritesActions.addFavoriteFailure({
            error: 'Utilisateur non connecté'
          }));
        }

        const userId = this.getCurrentUserId();
        if (!userId) {
          return of(FavoritesActions.addFavoriteFailure({
            error: 'Utilisateur non trouvé'
          }));
        }

        return this.favoritesService.getFavoritesByUserId(userId).pipe(
          switchMap(existingFavs => {

            const exists = existingFavs.some(
              fav => fav.slug === action.favorite.slug
            );

            if (exists) {
              return of(FavoritesActions.addFavoriteFailure({
                error: 'Ce job est déjà dans vos favoris.'
              }));
            }

            // ADD FAVORITE
            return this.favoritesService.addFavorites({
              ...action.favorite,
              userId
            }).pipe(
              map(favorite =>
                FavoritesActions.addFavoriteSuccess({ favorite })
              ),
              catchError(() =>
                of(FavoritesActions.addFavoriteFailure({
                  error: 'Erreur lors de l\'ajout aux favoris.'
                }))
              )
            );

          }),
          catchError(() =>
            of(FavoritesActions.addFavoriteFailure({
              error: 'Erreur lors de la vérification des favoris.'
            }))
          )
        );

      })
    )
  );

  // ================= DELETE FAVORITE =================
  deleteFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.deleteFavorite),
      mergeMap(action => {

        if (!this.authService.isLoggedInValue) {
          return of(FavoritesActions.deleteFavoriteFailure({
            error: 'Utilisateur non connecté'
          }));
        }

        return this.favoritesService.deleteFavorite(action.id).pipe(
          map(() =>
            FavoritesActions.deleteFavoriteSuccess({ id: action.id })
          ),
          catchError(() =>
            of(FavoritesActions.deleteFavoriteFailure({
              error: 'Erreur lors de la suppression.'
            }))
          )
        );

      })
    )
  );

  // ================= TOAST SUCCESS =================
  addFavoriteSuccessToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FavoritesActions.addFavoriteSuccess),
        tap(() => {
          this.toastService.show(
            'Job ajouté à vos favoris ! ❤️',
            'success'
          );
        })
      ),
    { dispatch: false }
  );

  // ================= TOAST ERROR =================
  addFavoriteErrorToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FavoritesActions.addFavoriteFailure),
        tap(action => {
          this.toastService.show(action.error, 'info');
        })
      ),
    { dispatch: false }
  );

}
