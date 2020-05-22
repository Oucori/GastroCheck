import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestSettingsPageRoutingModule } from './rest-settings-routing.module';

import { RestSettingsPage } from './rest-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestSettingsPageRoutingModule
  ],
  declarations: [RestSettingsPage]
})
export class RestSettingsPageModule {}
