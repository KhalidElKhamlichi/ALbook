import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, AuthResponse } from 'ngx-facebook';
import { Response } from '@angular/http/src/static_response';
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

  constructor(private fb: FacebookService, private router: Router) {}

  ngOnInit() {
    this.getProfile();
    this.getAlbums();
  }

  logout(): void {
    this.fb.logout().
      then(() => this.router.navigate(["/"]));
  }

  getProfile(): any {
    this.fb.api('/me')
      .then((res: any) => {
        console.log('Got the users profile', res);
        this.profile = res;
        this.getProfilePhoto();
      })
      .catch(() => this.router.navigate(["/"]));
  }

  getProfilePhoto() {
    this.fb.api("/"+this.profile['id']+"/picture?type=normal")
    .then((response) => {
      this.profilePhoto = { id: "0",
                          source: response.data.url };
    });
  }

  getAlbums() {
    this.fb.api("/me/albums?fields=id,name")
    .then((response) => { 

      for (let i=0; i<response.data.length; i++) {
        let album: Album = {
          id: response.data[i].id,
          name: response.data[i].name,
          photo: new Photo(),
          length: 0
        };    
        this.fb.api('/'+album.id+'/photos?fields=images')
        .then((photos) => {
          if (photos) {
            let photo: Photo = { source: photos.data[0].images[1]['source'],
                              id: photos.data[0].id };
            album.photo = photo; 
            album.length = photos.data.length;            
          }
          this.albums.push(album);
          
        });        
      }
    })
    .catch((error: any) => console.error(error));
  }

}

