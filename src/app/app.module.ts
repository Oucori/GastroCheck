import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import * as firebase from 'firebase';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { IonicStorageModule } from '@ionic/storage';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCg5hs9tldOK9HY2vgaBtJtJzEEPgzs9FE",
  authDomain: "gastrocheck.firebaseapp.com",
  databaseURL: "https://gastrocheck.firebaseio.com",
  projectId: "gastrocheck",
  storageBucket: "gastrocheck.appspot.com",
  messagingSenderId: "372557854794",
  appId: "1:372557854794:web:9465dadf0991710d460eb3",
  measurementId: "G-ZGWC1PBGG5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),IonicStorageModule.forRoot(), AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
