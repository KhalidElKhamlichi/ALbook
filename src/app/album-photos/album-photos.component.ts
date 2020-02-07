import { Component, OnInit } from '@angular/core';
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

  private getPhotos() {
    if(this.isAlbumFromFirebase())     
      this.firebaseService.fetchPhotos(this.setExportedPhotos());
    else
      this.socialMediaService.fetchPhotos(this.albumId, this.setSocialMediaPhotos());    
  }

  private isAlbumFromFirebase() {
    return this.albumSource == AlbumSource.Firebase;
  }

  private setExportedPhotos(): (photo: Photo) => void {
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
  
  private selectAll() {
    this.isSelectAllActive = !this.isSelectAllActive;
    // let updatePhotoSelection = this.isSelectAllActive ? photo => this.selectedPhotos.push(photo) : photo => this.selectedPhotos.splice(this.selectedPhotos.indexOf(photo), 1);
    const displayedPhotos = this.photos.slice(this.getStartIndex(), this.getEndIndex());
    console.log(displayedPhotos);
    for(let photo of displayedPhotos) {
      this.updatePhotosSelection(photo);
    } 
  }
  
  private updatePhotosSelection(photo: Photo) {
    if(this.isSelectAllActive) {
       this.selectedPhotos.push(photo);
    } else {
      this.selectedPhotos.splice(this.selectedPhotos.indexOf(photo), 1);
    }
  }

  private updatePhotoSelection(event, photo: Photo) {
    console.log(event);
    if(this.selectedPhotos.includes(photo)) {
      this.selectedPhotos.splice(this.selectedPhotos.indexOf(photo), 1);
    } else {
      this.selectedPhotos.push(photo);
    }
  }
  
  private getStartIndex(): number {
    return (this.paginatorEvent.pageSize * this.paginatorEvent.pageIndex);
  }

  private getEndIndex(): number {
    return (this.paginatorEvent.pageSize * (this.paginatorEvent.pageIndex+1));
  }
  
}
