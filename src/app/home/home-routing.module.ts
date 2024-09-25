import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'workout',
    loadChildren: () => import('./workout/workout.module').then( m => m.WorkoutPageModule)
  },
  {
    path: 'workout/:id',
    loadChildren: () => import('./workout/workout.module').then(m => m.WorkoutPageModule),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
