import { NgModule } from '@angular/core';
import {CommonModule, NgForOf} from '@angular/common'
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgressPageRoutingModule } from './progress-routing.module';

import { ProgressPage } from './progress.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProgressPageRoutingModule,
        IonicModule,
        NgForOf
    ],
  declarations: [ProgressPage]
})
export class ProgressPageModule {}
