import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'rest',
    loadChildren: () => import('./rest-details/rest-details.module').then( m => m.RestDetailsPageModule)
  },
  {
    path: 'rest-settings',
    loadChildren: () => import('./rest-settings/rest-settings.module').then( m => m.RestSettingsPageModule)
  },
  {
    path: 'usermanager',
    loadChildren: () => import('./usermanager/usermanager.module').then( m => m.UsermanagerPageModule)
  },
  {
    path: 'genqr',
    loadChildren: () => import('./genqr/genqr.module').then( m => m.GenqrPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }