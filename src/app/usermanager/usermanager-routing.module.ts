import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsermanagerPage } from './usermanager.page';

const routes: Routes = [
  {
    path: '',
    component: UsermanagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsermanagerPageRoutingModule {}
