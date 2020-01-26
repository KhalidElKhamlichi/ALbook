import { Component, OnInit } from '@angular/core';
import { FacebookService } from 'ngx-facebook';
import { ActivatedRoute } from '@angular/router';
import {PageEvent} from '@angular/material';

import { Photo } from './../photo';

@Component({
  selector: 'album-photos',
  templateUrl: './album-photos.component.html',
  styleUrls: ['./album-photos.component.css']
})
export class AlbumPhotosComponent implements OnInit {

  isLoaded: boolean;
  albumID: string;
  photos: Photo[] = []; // All photos
  selectedPhotos: Photo[] = []; 

  paginatorEvent: PageEvent = new PageEvent();
  pageIndex: number = 0;
  pageSize: number = 5;
  pageSizeOptions = [5, 10, 25, 100]; 

  isSelectAllActive: boolean;

  constructor(private fb: FacebookService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.albumID = this.route.snapshot.paramMap.get('id');
    this.getPhotos();
    
    this.paginatorEvent.pageIndex = this.pageIndex;
    this.paginatorEvent.pageSize = this.pageSize;
  }


  getPhotos() {         
    this.fb.api('/'+this.albumID+'/photos?fields=images')
    .then((photos) => {
      console.log(photos);
      if (photos.data) {
        photos.data.forEach(response => {
          let photo: Photo = { source: response.images[1]['source'],
                                id: response.id };
          this.photos.push(photo);            
        });
      }
      this.isLoaded = true;
    })
    .catch((error: any) => console.error(error));        
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
