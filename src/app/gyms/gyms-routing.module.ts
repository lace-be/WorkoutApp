import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GymsPage } from './gyms.page';

const routes: Routes = [
  {
    path: '',
    component: GymsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GymsPageRoutingModule {}
