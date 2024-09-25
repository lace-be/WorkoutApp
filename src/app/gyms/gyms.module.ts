import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GymsPageRoutingModule } from './gyms-routing.module';

import { GymsPage } from './gyms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GymsPageRoutingModule
  ],
  declarations: [GymsPage]
})
export class GymsPageModule {}
