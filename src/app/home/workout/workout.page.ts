import {Component, OnInit} from '@angular/core'
import {WorkoutService} from '../../services/workout.service'
import {ActivatedRoute, Router} from '@angular/router'
import { IExerciseApiResult } from 'src/models/IExerciseApiResult'
import {IWorkout} from '../../../models/IWorkout'
import {WorkoutStorageService} from '../../services/workout-storage.service'

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit {
  workout!: IWorkout
  isEditMode: boolean = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService,
    private workoutStorageService: WorkoutStorageService
  ) {}

  ngOnInit() {
    const workoutId = this.route.snapshot.queryParamMap.get('workoutId')
    const isNew = this.route.snapshot.queryParamMap.get('isNew') === 'true'
    this.isEditMode = workoutId !== null
    if (isNew) {
      this.workout = this.createEmptyWorkout()
      this.workoutStorageService.setWorkout(this.workout)
    } else {
      if (workoutId) {
        const existingWorkout = this.workoutService.getWorkout(workoutId)
        if (existingWorkout) {
          this.workout = existingWorkout
          this.workoutStorageService.setWorkout(this.workout)
        } else {
          console.error('Workout not found.')
          this.workout = this.createEmptyWorkout()
          this.workoutStorageService.setWorkout(this.workout)
        }
      } else {
        console.error('No workoutId provided.')
        this.workout = this.createEmptyWorkout()
        this.workoutStorageService.setWorkout(this.workout)
      }
    }
  }

  createEmptyWorkout(): IWorkout {
    return {
      name: '',
      id: window.crypto.randomUUID(),
      exercises: []
    }
  }

  addExercise() {
    this.router.navigate(['/home/workout/exercise', this.workout.id])
  }

  saveWorkout() {
    if (this.route.snapshot.queryParamMap.get('isNew') === 'true') {
      this.workoutService.createWorkout(this.workout)
    } else {
      const existingWorkout = this.workoutService.getWorkout(this.workout.id)
      if (existingWorkout) {
        this.workoutService.updateWorkout(this.workout)
      } else {
        console.error('Trying to update a non-existent workout.')
      }
    }
    this.workoutStorageService.clearWorkout()
    this.router.navigate(['/home'])
  }

  deleteExercise(exercise: IExerciseApiResult) {
    this.workout.exercises = this.workout.exercises.filter(e => e !== exercise)
  }
}
