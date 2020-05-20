import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminRestModalPageRoutingModule } from './admin-rest-modal-routing.module';

import { AdminRestModalPage } from './admin-rest-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRestModalPageRoutingModule
  ],
  declarations: [AdminRestModalPage]
})
export class AdminRestModalPageModule {}
