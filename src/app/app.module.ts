import { HomeComponent } from './home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FacebookModule } from 'ngx-facebook';
import { AlbumComponent } from './album-card/album-card.component';
import { LoginComponent } from './login/login.component';
import { MatButtonModule, MatCardModule, MatCheckboxModule } from '@angular/material';
import { AlbumPhotosComponent } from './album-photos/album-photos.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AlbumComponent,
    LoginComponent,
    AlbumPhotosComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    FacebookModule.forRoot(),
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'albums/:id', component: AlbumPhotosComponent },
      { path: '**', component: LoginComponent }            
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
