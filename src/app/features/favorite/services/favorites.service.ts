
//src/app/features/favorite/services/favorites.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Favorite } from '../models/favorite.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private apiUrl = 'http://localhost:3000/favoritesOffers';
  constructor(private http: HttpClient) { }

  addFavorites(favorite: Favorite) {
    return this.http.post<Favorite>(this.apiUrl, favorite)
  }

  getFavoritesByUserId(userId: number) {
  console.log('Service: fetching favorites for userId:', userId);
  return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`).pipe(
    map(favs => {
      console.log('Service: received favorites', favs);
      return favs;
    })
  );
}


  deleteFavorite(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getFavoriteByJobIdAndUserId(jobId: string, userId: number): Observable<boolean> {
    return this.http.get<Favorite[]>(`${this.apiUrl}?slug=${jobId}&userId=${userId}`).pipe(
      map(favorites => {
        return favorites.length > 0;
      })
    );
  }




}
