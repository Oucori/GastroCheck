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
    path: 'admin-rest-modal',
    loadChildren: () => import('./admin-rest-modal/admin-rest-modal.module').then( m => m.AdminRestModalPageModule)
  },
  {
    path: 'rest-settings',
    loadChildren: () => import('./rest-settings/rest-settings.module').then( m => m.RestSettingsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
