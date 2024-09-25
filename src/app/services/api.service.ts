import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IExerciseApiResult } from 'src/models/IExerciseApiResult';
import {map, Observable} from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.api-ninjas.com/v1/exercises';
  private apiKey = environment.exercisesApiKey;

  constructor(private http: HttpClient) {}

  getExercises(searchTerm: string = ''): Observable<IExerciseApiResult[]> {
    const headers = new HttpHeaders().set('X-Api-Key', this.apiKey);
    const params = { name: searchTerm };
    return this.http.get<IExerciseApiResult[]>(this.apiUrl, { headers, params });
  }
}
