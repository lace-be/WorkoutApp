import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LoginPage } from './login.page'
import {PhoneVerificationComponent} from './phone-verification/phone-verification.component'

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
