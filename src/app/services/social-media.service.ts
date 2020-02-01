import { Injectable } from '@angular/core';
import { FacebookService } from 'ngx-facebook';
import { Photo } from '../models/photo';
import { Album } from '../models/album';
import { Router } from '@angular/router';

@Injectable()
export class SocialMediaService {
  
  constructor(private facebook: FacebookService, private router: Router) { }
  
  fetchFacebookUsername(onSuccess: (username) => void, onError: () => void) {
    this.facebook.api('/me')
    .then((response) => onSuccess(response['name']))
    .catch(() => onError());
  }
  
  fetchFacebookAlbums(onSuccess: (album) => void) {
    this.facebook.api("/me/albums?fields=id,name")
    .then((response) => { 
      response.data.forEach(facebookAlbum => {    
        this.facebook.api('/'+facebookAlbum.id+'/photos?fields=images')
        .then((photos) => {
          if (photos) {
            let photo: Photo = new Photo(photos.data[0].id, photos.data[0].images[1]['source']);
            let album: Album = new Album(facebookAlbum.id, facebookAlbum.name, photo, photos.data.length);
            onSuccess(album);
          }
        });
      })
      .catch((error: any) => console.error(error));
    });
  }
  
  fetchProfile(onSuccess: (response) => void) {
    this.facebook.api('/me')
      .then((response) => onSuccess(response))
      .catch(() => this.router.navigate(["/"]));
  }

  fetchProfilePhoto(profileId: string, onSuccess: (response) => void) {
    this.facebook.api("/"+profileId+"/picture?type=normal")
    .then(response => onSuccess(response));
  }

  logout() {
    this.facebook.logout().then(() => this.router.navigate(["/"]));
  }
}
