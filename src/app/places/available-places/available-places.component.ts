import {Component, inject, OnInit, signal} from '@angular/core';

import {Place} from '../place.model';
import {PlacesComponent} from '../places.component';
import {PlacesContainerComponent} from '../places-container/places-container.component';
import {HttpClient} from "@angular/common/http";
import {catchError, map, pipe, throwError} from "rxjs";

@Component({
    selector: 'app-available-places',
    standalone: true,
    templateUrl: './available-places.component.html',
    styleUrl: './available-places.component.css',
    imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
    places = signal<Place[] | undefined>(undefined);
    isFetching=signal<boolean>(true);
    error = signal('');
    private httpClient = inject(HttpClient);

    ngOnInit() {
        const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places')
            .pipe(map(responseData =>
                responseData.places),catchError((error)=>throwError(()=>new Error('Something went wrong ! ')))).subscribe({
                next: (places) => {
                    this.places.set(places);
                },
                complete: () => {
                    this.isFetching.set(false);
                },
                error: (error) => {
                    this.error.set(error.message);
                }
            });

    }
}
