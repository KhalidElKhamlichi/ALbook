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

  isLoaded: boolean = false; // have the photos been loaded
  albumID: string;
  photos: Photo[] = []; // All photos
  selectedPhotos: Photo[] = [];

  pageEvent: PageEvent = new PageEvent();
  pageIndex: number = 0;
  pageSize: number = 5;
  pageSizeOptions = [5, 10, 25, 100];
  length: number;

  checkAll: boolean = false;

  constructor(private fb: FacebookService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.albumID = this.route.snapshot.paramMap.get('id');
    this.getPhotos();
    
    this.pageEvent.pageIndex = this.pageIndex;
    this.pageEvent.pageSize = this.pageSize;
  }


  getPhotos() {         
    this.fb.api('/'+this.albumID+'/photos?fields=images')
    .then((photos) => {
      if (photos.data){
        
        for (let j=0; j<photos.data.length; j++){
          let photo: Photo = { source: photos.data[j].images[1]['source'],
                                id: photos.data[j].id };
          this.photos.push(photo);              
        }
      }
      this.isLoaded = true;
      this.length = this.photos.length;
    })
    .catch((error: any) => console.error(error));        
      
  }
  
  setPhotoSelection(index: number) {

    if(this.selectedPhotos.includes(this.photos[index])) { // remove photo from selectedPhotos if it already exists in it
      index = this.selectedPhotos.indexOf(this.photos[index]);
      this.selectedPhotos.splice(index, 1);
    }
    else {
      this.selectedPhotos.push(this.photos[index]);
    }

  }

  selectAll() {
    this.checkAll = !this.checkAll;
    for(let photo of this.photos) {
      this.setPhotoSelection(this.photos.indexOf(photo));
    } 
  }

  getStartIndex(): number {
    return (this.pageEvent.pageSize * this.pageEvent.pageIndex);
  }

  getEndIndex(): number {
    return (this.pageEvent.pageSize * (this.pageEvent.pageIndex+1));
  }
  
}
