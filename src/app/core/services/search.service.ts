import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private searchQuerySubject = new BehaviorSubject<string>('');
    private locationQuerySubject = new BehaviorSubject<string>('');

    searchQuery$ = this.searchQuerySubject.asObservable();
    locationQuery$ = this.locationQuerySubject.asObservable();

    setSearchQuery(query: string): void {
        this.searchQuerySubject.next(query);
    }

    getSearchQueryValue(): string {
        return this.searchQuerySubject.value;
    }

    setLocationQuery(query: string): void {
        this.locationQuerySubject.next(query);
    }

    getLocationQueryValue(): string {
        return this.locationQuerySubject.value;
    }
}
