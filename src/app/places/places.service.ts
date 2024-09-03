import {inject, Injectable, signal} from '@angular/core';

import { Place } from './place.model';
import {catchError, map, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchAvailablePlaces(('http://localhost:3000/places'),'Something went wrong !')
  }

  loadUserPlaces() {
    return this.fetchAvailablePlaces(('http://localhost:3000/user-places'),'Something went wrong !').pipe(tap({
      next : (userPlaces)=> this.userPlaces.set(userPlaces),
    })
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();
    if (!prevPlaces.some((p) => p.id === place.id)) {
        this.userPlaces.set([...prevPlaces, place])
    }

    return this.httpClient.put('http://localhost:3000/user-places/', {
      placeId : place.id,
    }).pipe(
        catchError(error => {
          this.userPlaces.set(prevPlaces);
          return throwError(() => new Error('Something went wrong !'));
        })
  );
  }

  removeUserPlace(place: Place) {}

  fetchAvailablePlaces(url:string,message:string) {
    return this.httpClient.get<{ places: Place[] }>(url)
        .pipe(map(responseData =>
            responseData.places),catchError((error)=>throwError(()=>new Error(message))))
  }
}
