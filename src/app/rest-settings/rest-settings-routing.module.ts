import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestSettingsPage } from './rest-settings.page';

const routes: Routes = [
  {
    path: '',
    component: RestSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestSettingsPageRoutingModule {}
