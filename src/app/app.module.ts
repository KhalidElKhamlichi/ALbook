import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatProgressBarModule,
   MatPaginatorModule, MatSnackBarModule, MatButtonToggleModule, MatTooltipModule } from '@angular/material';
import {AngularFireModule} from 'angularfire2';
import { FacebookModule } from 'ngx-facebook';
import {AngularFireDatabaseModule} from 'angularfire2/database';

import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { AlbumComponent } from './album-card/album-card.component';
import { LoginComponent } from './login/login.component';
import { AlbumPhotosComponent } from './album-photos/album-photos.component';
import {FirebaseService} from './services/firebase.service';
import {SocialMediaService} from './services/social-media.service';
import { ExportPhotosComponent } from './export-photos/export-photos.component';
import {environment} from '../environments/environment';
import { AlbumService } from './services/album.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AlbumComponent,
    LoginComponent,
    AlbumPhotosComponent,
    ExportPhotosComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatTooltipModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FacebookModule.forRoot(),
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'albums/:id', component: AlbumPhotosComponent },
      { path: '**', component: LoginComponent }            
    ])
  ],
  providers: [FirebaseService, SocialMediaService, AlbumService],
  bootstrap: [AppComponent]
})
export class AppModule { }
