import {Component, inject, OnInit} from '@angular/core'
import {Capacitor} from '@capacitor/core'
import {AuthService} from '../services/auth.service'
import {ModalController} from '@ionic/angular'
import {PhoneVerificationComponent} from './phone-verification/phone-verification.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  isNative = Capacitor.isNativePlatform()

  authService = inject(AuthService)
  #modalController = inject(ModalController)

  constructor() { }

  async showPhoneVerification(): Promise<void> {
    const modal = await this.#modalController.create({
      component: PhoneVerificationComponent,
    })
    return await modal.present()
  }
}
