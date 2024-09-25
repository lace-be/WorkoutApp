import { Component } from '@angular/core'
import { IWorkout } from '../../models/IWorkout'
import { WorkoutService } from '../services/workout.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  workouts!: IWorkout[]

  constructor(private workoutService: WorkoutService, private router: Router) {
    this.loadWorkouts()
  }

  ionViewWillEnter() {
    this.loadWorkouts()
  }

  loadWorkouts() {
    this.workouts = this.workoutService.getWorkouts()
  }

  createWorkout() {
    this.router.navigate(['/home/workout'], { queryParams: { isNew: true } })
  }

  editWorkout(workout: IWorkout) {
    this.router.navigate(['/home/workout'], { queryParams: { workoutId: workout.id } })
  }

  deleteWorkout(workoutId: string) {
    this.workoutService.deleteWorkout(workoutId!)
    this.loadWorkouts()
  }
}
