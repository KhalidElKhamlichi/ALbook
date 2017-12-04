import { HomeComponent } from './home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FacebookModule } from 'ngx-facebook';
import { AlbumComponent } from './album/album.component';
import { LoginComponent } from './login/login.component';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AlbumComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FacebookModule.forRoot(),
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: '', component: LoginComponent },
      { path: '**', component: LoginComponent }            
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
