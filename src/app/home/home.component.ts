import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, AuthResponse } from 'ngx-facebook';
import { Album } from '../album';
import { Router } from '@angular/router';

import { Photo } from './../photo';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  profile = {};
  profilePhoto: Photo;
  albums: Album[] = [];

  constructor(private facebook: FacebookService, private router: Router) {}

  ngOnInit() {
    this.getProfile();
    this.getAlbums();
  }

  logout(): void {
    this.facebook.logout().
      then(() => this.router.navigate(["/"]));
  }

  getProfile(): any {
    this.facebook.api('/me')
      .then((res: any) => {
        this.profile = res;
        this.getProfilePhoto();
      })
      .catch(() => this.router.navigate(["/"]));
  }

  getProfilePhoto() {
    this.facebook.api("/"+this.profile['id']+"/picture?type=normal")
    .then((response) => {
      this.profilePhoto = new Photo("0", response.data.url);
    });
  }

  getAlbums() {
    this.facebook.api("/me/albums?fields=id,name")
    .then((response) => { 
      response.data.forEach(facebookAlbum => {    
        this.facebook.api('/'+facebookAlbum.id+'/photos?fields=images')
        .then((photos) => {
            if (photos) {
              let photo: Photo = new Photo(photos.data[0].id, photos.data[0].images[1]['source']);
              let album: Album = new Album(facebookAlbum.id, facebookAlbum.name, photo, photos.data.length);
              this.albums.push(album);
            }    
        });  
      });
    })
    .catch((error: any) => console.error(error));
  }

}

