import { NgModule } from '@angular/core';
import {CommonModule, NgForOf, TitleCasePipe} from '@angular/common'
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExercisePageRoutingModule } from './exercise-routing.module';

import { ExercisePage } from './exercise.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ExercisePageRoutingModule,
        IonicModule,
        NgForOf,
        TitleCasePipe
    ],
  declarations: [ExercisePage]
})
export class ExercisePageModule {}
