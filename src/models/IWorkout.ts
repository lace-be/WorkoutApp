import {IExerciseApiResult} from './IExerciseApiResult'

export interface IWorkout {
  name: string
  id: string
  exercises: IExerciseApiResult[]
}
