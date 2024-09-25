import { Injectable } from '@angular/core';
import {IWorkout} from '../../models/IWorkout'

@Injectable({
  providedIn: 'root'
})
export class WorkoutStorageService {
  private workout: IWorkout | null = null;

  setWorkout(workout: IWorkout) {
    this.workout = workout;
  }

  getWorkout(): IWorkout | null {
    return this.workout;
  }

  clearWorkout() {
    this.workout = null;
  }
}
