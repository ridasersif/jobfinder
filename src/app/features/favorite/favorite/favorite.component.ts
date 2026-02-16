import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import * as FavoritesSelectors from '../../favorite/state/favorites.selectors';
import * as FavoritsAction from '../../favorite/state/favorites.actions'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorite',
   imports: [CommonModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {

  favorites$!: Observable<Favorite[]>
  constructor(
    private store: Store,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.favorites$ = this.store.select(
      FavoritesSelectors.selectAllFavorites
    );

    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.store.dispatch(
        FavoritsAction.loadFavorites({ userId: user.id })
      )
    }

  }

}
