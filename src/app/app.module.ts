import { HomeComponent } from './home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FacebookModule } from 'ngx-facebook';
import { AlbumComponent } from './album-card/album-card.component';
import { LoginComponent } from './login/login.component';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatProgressBarModule, MatPaginatorModule, MatSnackBarModule, MatButtonToggleModule, MatTooltipModule } from '@angular/material';
import { AlbumPhotosComponent } from './album-photos/album-photos.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {UploadFileService} from './services/upload-file.service';

import {environment} from '../environments/environment';
import { ExportPhotosComponent } from './export-photos/export-photos.component';

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
    AngularFireDatabaseModule, // for database
    FacebookModule.forRoot(),
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'albums/:id', component: AlbumPhotosComponent },
      { path: '**', component: LoginComponent }            
    ])
  ],
  providers: [UploadFileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
