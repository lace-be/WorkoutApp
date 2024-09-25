import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'

import {IonicModule} from '@ionic/angular'

import {SwipePageRoutingModule} from './swipe-routing.module'

import {SwipePage} from './swipe.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwipePageRoutingModule
  ],
  declarations: [SwipePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwipePageModule {}
