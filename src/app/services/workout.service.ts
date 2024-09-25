import { Injectable } from '@angular/core';
import {IWorkout} from '../../models/IWorkout'
import {IExerciseApiResult} from '../../models/IExerciseApiResult'
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private workoutsSubject = new BehaviorSubject<IWorkout[]>([]);
  workouts$ = this.workoutsSubject.asObservable();

  constructor() {
    this.workoutsSubject.next([]);
  }

  private getWorkoutsValue(): IWorkout[] {
    return this.workoutsSubject.getValue();
  }

  getWorkouts(): IWorkout[] {
    return this.getWorkoutsValue();
  }

  getWorkout(id: string): IWorkout | undefined {
    return this.getWorkoutsValue().find(w => w.id === id);
  }

  createWorkout(workout: IWorkout): void {
    const currentWorkouts = this.getWorkoutsValue();
    this.workoutsSubject.next([...currentWorkouts, workout]);
  }

  updateWorkout(updatedWorkout: IWorkout): void {
    const currentWorkouts = this.getWorkoutsValue();
    const index = currentWorkouts.findIndex(workout => workout.id === updatedWorkout.id);

    if (index > -1) {
      currentWorkouts[index] = updatedWorkout;
      this.workoutsSubject.next([...currentWorkouts]);
    } else {
      console.error('Trying to update a non-existent workout with ID:', updatedWorkout.id);
    }
  }

  deleteWorkout(id: string): void {
    const currentWorkouts = this.getWorkoutsValue();
    this.workoutsSubject.next(currentWorkouts.filter(w => w.id !== id));
  }
}
