import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
import { Response } from '@angular/http/src/static_response';
import { Album } from '../album';
import { Router } from '@angular/router';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  profile = {};
  albums: Album[] = [];
  constructor(private fb: FacebookService, private router: Router) {}

  ngOnInit() {
    this.getProfile();
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
      })
      .catch();
  }

  /*getPhoto() {
    this.fb.api("/287114081385725?fields=images")
    .then((response) => {
      console.log(response);
      this.photos.push(response.images[1]);
    });
  }*/

  getAlbums() {
    this.fb.api("/me/albums?fields=id,name")
    .then((response) => { 
      console.log(response.data.length);
      for (let i=0; i<response.data.length; i++) {
        let album: Album = {
          id: response.data[i].id,
          name: response.data[i].name,
          photos: []
        };
        /*album.name = response.data[i].name;
        album.id = response.data[i].id;*/       
        this.fb.api('/'+album.id+'/photos?fields=images')
        .then((photos) => {
          if (photos && photos.data && photos.data.length){
            for (let j=0; j<photos.data.length; j++){
              let photo = photos.data[0];
              album.photos.push(photo.images[j]);              
              // photo.picture contain the link to picture
              //console.log(photo);
              //this.photos.push(photo.images[1]);
            }
            this.albums.push(album);
          }
        });        
      }
    })
    .catch((error: any) => console.error(error));
  }

  getLoginStatus(): any{
    this.fb.getLoginStatus()
      .then(console.log.bind(console))
      .catch(console.error.bind(console));
  }
}

