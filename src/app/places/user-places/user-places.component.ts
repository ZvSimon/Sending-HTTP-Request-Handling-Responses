import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import {Place} from "../place.model";
import {PlacesService} from "../places.service";
import {HttpClient} from "@angular/common/http";
import {catchError, map, throwError} from "rxjs";

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{
  private destroyRef =inject(DestroyRef) ;
  private placeService: PlacesService = inject(PlacesService);
  isFetching = signal<boolean>(true);
  places = this.placeService.loadedUserPlaces;
  error = signal('');

  ngOnInit() {
    const subscription = this.placeService.loadUserPlaces().subscribe({

      complete: () => {
        this.isFetching.set(false);
      },
      error: (error) => {
        this.error.set(error.message);
      }
    });
    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe()
    })

  }
  onDeleteUserPlaces(place: Place) {
    const subscription = this.placeService.removeUserPlace(place).subscribe({
      next: (resData) => console.log(resData),
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

}
