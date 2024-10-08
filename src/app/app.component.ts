import {Component, inject} from '@angular/core'
import {AuthService} from './services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  readonly placeholder = '/assets/Portrait_Placeholder.png'
  authService = inject(AuthService)
  constructor() {}
}
