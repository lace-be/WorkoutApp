import {Component, inject, OnInit} from '@angular/core'
import {ApiService } from 'src/app/services/api.service'
import {IExerciseApiResult} from '../../../../models/IExerciseApiResult'
import {ActivatedRoute} from '@angular/router'
import {WorkoutStorageService} from '../../../services/workout-storage.service'
import {debounceTime, distinctUntilChanged, Subject, switchMap} from 'rxjs'
import {NavController} from '@ionic/angular'

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit {
  exercises: IExerciseApiResult[] = []
  searchTerm = new Subject<string>()
  workoutId: string | null = null
  navController = inject(NavController)
  constructor(
    private exerciseService: ApiService,
    private route: ActivatedRoute,
    private workoutStorageService: WorkoutStorageService
  ) {}

  ngOnInit() {
    this.workoutId = this.route.snapshot.paramMap.get('id')

    this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.exerciseService.getExercises(term))
    ).subscribe(exercises => {
      this.exercises = exercises
    });

    // Fetch initial exercises without any filter
    this.exerciseService.getExercises().subscribe(exercises => {
      this.exercises = exercises
    })
  }

  onSearchChange(event: any) {
    const term = event.target.value
    this.searchTerm.next(term)
  }

  selectExercise(exercise: IExerciseApiResult) {
    const workout = this.workoutStorageService.getWorkout()
    if (workout) {
      workout.exercises.push(exercise)
      this.navController.back()
    } else {
      console.error('Workout not found')
    }
  }
}
