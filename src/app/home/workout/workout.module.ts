import { NgModule } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common'
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutPageRoutingModule } from './workout-routing.module';

import { WorkoutPage } from './workout.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WorkoutPageRoutingModule,
        IonicModule,
        IonicModule,
        IonicModule,
        NgIf
    ],
  declarations: [WorkoutPage]
})
export class WorkoutPageModule {}
