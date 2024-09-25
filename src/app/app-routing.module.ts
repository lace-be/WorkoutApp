import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard'

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard],
    data: {authGuardPipe: () => redirectUnauthorizedTo(['login'])},
  },
  {
    path: 'progress',
    loadChildren: () => import('./progress/progress.module').then( m => m.ProgressPageModule),
    canActivate: [AuthGuard],
    data: {authGuardPipe: () => redirectUnauthorizedTo(['login'])},
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'gyms',
    loadChildren: () => import('./gyms/gyms.module').then( m => m.GymsPageModule),
    data: {authGuardPipe: () => redirectUnauthorizedTo(['login'])},
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
