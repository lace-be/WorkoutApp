import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgressPage } from './progress.page';

const routes: Routes = [
  {
    path: '',
    component: ProgressPage
  },
  {
    path: 'swipe/:index',
    loadChildren: () => import('./swipe/swipe.module').then( m => m.SwipePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgressPageRoutingModule {}
