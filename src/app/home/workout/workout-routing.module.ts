import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutPage } from './workout.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutPage
  },
  {
    path: 'exercise',
    loadChildren: () => import('./exercise/exercise.module').then( m => m.ExercisePageModule)
  },
  {
    path: 'exercise/:id',
    loadChildren: () => import('./exercise/exercise.module').then(m => m.ExercisePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutPageRoutingModule {}
