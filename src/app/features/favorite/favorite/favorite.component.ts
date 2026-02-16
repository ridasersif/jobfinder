import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import * as FavoritesSelectors from '../../favorite/state/favorites.selectors';
import * as FavoritsAction from '../../favorite/state/favorites.actions'
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorite',
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {

  favorites$!: Observable<Favorite[]>
  showDeleteModal = false;
  jobIdToDelete: number | undefined = undefined;

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

  removeFavorite(id: number | undefined): void {
    if (id) {
      this.jobIdToDelete = id;
      this.showDeleteModal = true;
    }
  }

  confirmDelete(): void {
    if (this.jobIdToDelete) {
      this.store.dispatch(FavoritsAction.deleteFavorite({ id: this.jobIdToDelete }));
      this.cancelDelete();
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.jobIdToDelete = undefined;
  }

}
