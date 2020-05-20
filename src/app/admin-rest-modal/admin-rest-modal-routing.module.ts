import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminRestModalPage } from './admin-rest-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AdminRestModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRestModalPageRoutingModule {}
