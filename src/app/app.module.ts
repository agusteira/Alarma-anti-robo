import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig), AngularFireAuthModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"proyecto-pps-cd551","appId":"1:267186802448:web:f9eb65ed5f4a752f395f95","storageBucket":"proyecto-pps-cd551.appspot.com","apiKey":"AIzaSyDVxLsH_a43OIIzjX7Z3JWKf924_6G-gYc","authDomain":"proyecto-pps-cd551.firebaseapp.com","messagingSenderId":"267186802448","measurementId":"G-99X80TF0P9"})), provideAuth(() => getAuth())],
  bootstrap: [AppComponent],
})
export class AppModule {}
