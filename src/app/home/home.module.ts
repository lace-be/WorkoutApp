import { NgModule } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common'
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        IonicModule,
        IonicModule,
        NgIf,
        IonicModule,
        IonicModule,
        IonicModule,
        NgIf,
        IonicModule,
        IonicModule,
        IonicModule,
        IonicModule,
        NgIf,
        IonicModule,
        IonicModule
    ],
  declarations: [HomePage]
})
export class HomePageModule {}
