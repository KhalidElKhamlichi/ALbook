import { Component, OnInit } from '@angular/core';
import { InitParams, LoginResponse, AuthResponse } from 'ngx-facebook';
import { Album } from '../models/album';
import { Router } from '@angular/router';

import { Photo } from '../models/photo';
import { SocialMediaService } from '../services/social-media.service';
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  profile = {};
  profilePhoto: Photo;
  socialMediaAlbums: Album[] = [];
  exportedAlbums: Album[] = [];

  constructor(private socialMediaService: SocialMediaService, private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.getProfile();
    this.getAlbums();
  }

  logout(): void {
    this.socialMediaService.logout();
  }

  getProfile(): any {
    this.socialMediaService.fetchProfile(this.setProfile());
  }

  private setProfile(): any {
    return (res: any) => {
      this.profile = res;
      this.getProfilePhoto();
      this.firebaseService.fetchExportedAlbums(this.profile['name'], this.addExportedAlbum());
    };
  }

  getProfilePhoto() {
    this.socialMediaService.fetchProfilePhoto(this.profile['id'], this.setProfilePhoto());
  }

  private setProfilePhoto(): any {
    return (response) => {
      this.profilePhoto = new Photo("0", response.data.url);
    };
  }

  getAlbums() {
    this.socialMediaService.fetchFacebookAlbums(this.addFacebookAlbum());
  }


  private addFacebookAlbum(): (value: any) => void {
    return (album) => {
      this.socialMediaAlbums.push(album);
    };
  }

  private addExportedAlbum(): (value: any) => void {
    return (album) => {
      debugger
      console.log("response");
      console.log(album);
      this.exportedAlbums.push(album);
    };
  }
}

