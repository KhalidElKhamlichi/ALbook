import { Component, OnInit } from '@angular/core';
import { FacebookService } from 'ngx-facebook';
import { ActivatedRoute } from '@angular/router';
import {PageEvent} from '@angular/material';

import { Photo } from '../models/photo';
import { SocialMediaService } from '../services/social-media.service';
import { FirebaseService } from '../services/firebase.service';
import { AlbumService } from '../services/album.service';
import { AlbumSource } from '../models/album-source.enum';

@Component({
  selector: 'album-photos',
  templateUrl: './album-photos.component.html',
  styleUrls: ['./album-photos.component.css']
})
export class AlbumPhotosComponent implements OnInit {

  isLoaded: boolean;
  albumId: string;
  albumSource: AlbumSource = AlbumSource.Facebook;
  photos: Photo[] = [];
  selectedPhotos: Photo[] = []; 

  paginatorEvent: PageEvent = new PageEvent();
  pageIndex: number = 0;
  pageSize: number = 5;
  pageSizeOptions = [5, 10, 25, 100]; 

  isSelectAllActive: boolean;

  constructor(private socialMediaService: SocialMediaService, private firebaseService: FirebaseService,
    private albumService: AlbumService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.albumId = this.route.snapshot.paramMap.get('id');
    this.albumService.getObservableAlbumSource().subscribe((albumSource) => this.albumSource = albumSource);
    this.getPhotos();
    
    this.paginatorEvent.pageIndex = this.pageIndex;
    this.paginatorEvent.pageSize = this.pageSize;
  }

  getPhotos() {
    if(this.albumSource == AlbumSource.Firebase)     
      this.firebaseService.fetchPhotos(this.setExportedPhotos());
    else
      this.socialMediaService.fetchPhotos(this.albumId, this.setSocialMediaPhotos());    
  }

  setExportedPhotos(): (photo: Photo) => void {
    return (photo: Photo) => this.photos.push(photo);
  }
  
  private setSocialMediaPhotos(): any {
    return (photos) => {
      if (photos.data) {
        photos.data.forEach(response => {
          let photo: Photo = new Photo(response.id, response.images[1]['source']);
          this.photos.push(photo);
        });
      }
      this.isLoaded = true;
    };
  }
  
  selectAll() {
    this.isSelectAllActive = !this.isSelectAllActive;
    for(let photo of this.photos) {
      this.updatePhotoSelection(this.photos.indexOf(photo));
    } 
  }
  
  updatePhotoSelection(index: number) {
    if(this.selectedPhotos.includes(this.photos[index])) { 
      index = this.selectedPhotos.indexOf(this.photos[index]);
      this.selectedPhotos.splice(index, 1);
    }
    else {
      this.selectedPhotos.push(this.photos[index]);
    }
  }

  getStartIndex(): number {
    return (this.paginatorEvent.pageSize * this.paginatorEvent.pageIndex);
  }

  getEndIndex(): number {
    return (this.paginatorEvent.pageSize * (this.paginatorEvent.pageIndex+1));
  }
  
}
