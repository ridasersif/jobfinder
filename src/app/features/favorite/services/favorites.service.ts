import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Favorite } from '../models/favorite.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private apiUrl = 'http://localhost:3000/favoritesOffers';
  constructor(private http: HttpClient) { }

  addFavorites(favorite: Favorite) {
    return this.http.post<Favorite>(this.apiUrl, favorite)
  }

  getFavoritesByUserId(userId: number) : Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`);
  }

  deleteFavorite(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


}
