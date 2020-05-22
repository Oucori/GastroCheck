import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsermanagerPageRoutingModule } from './usermanager-routing.module';

import { UsermanagerPage } from './usermanager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsermanagerPageRoutingModule
  ],
  declarations: [UsermanagerPage]
})
export class UsermanagerPageModule {}
