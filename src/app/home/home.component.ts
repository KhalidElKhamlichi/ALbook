import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
import { Response } from '@angular/http/src/static_response';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  photos = [];
  constructor(private fb: FacebookService) {}

  ngOnInit() {
    
  }

  logout(): void {
    this.fb.logout().
      then(() => console.log('Logged out!'));
  }

  getProfile() {
    this.fb.api('/me')
      .then((res: any) => {
        console.log('Got the users profile', res);
      })
      .catch();
  }

  getPhoto() {
    this.fb.api("/287114081385725?fields=images")
    .then((response) => {
      console.log(response);
      this.photos.push(response.images[1]);
    });
  }

  getPhotos() {
    this.fb.api("/me/albums?fields=id,name")
    .then((response) => { 
      console.log(response.data.length);
      for (let i=0; i<response.data.length; i++) {
        let album = response.data[i];
        console.log(album);       
        this.fb.api('/'+album.id+'/photos?fields=images')
        .then((photos) => {
          if (photos && photos.data && photos.data.length){
            for (let j=0; j<photos.data.length; j++){
              let photo = photos.data[j];
              // photo.picture contain the link to picture
              console.log(photo);
              this.photos.push(photo.images[1]);
            }
          }
        });        
      }
    })
    .catch((error: any) => console.error(error));
  }

  getLoginStatus() {
    this.fb.getLoginStatus()
      .then(console.log.bind(console))
      .catch(console.error.bind(console));
  }
}
