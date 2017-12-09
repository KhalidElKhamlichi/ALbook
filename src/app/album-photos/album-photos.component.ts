import { Component, OnInit } from '@angular/core';
import { FacebookService } from 'ngx-facebook';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'album-photos',
  templateUrl: './album-photos.component.html',
  styleUrls: ['./album-photos.component.css']
})
export class AlbumPhotosComponent implements OnInit {

  isLoaded: boolean = false;
  albumID: string;
  photos: any[] = [];
  photosToExport: any[] = [];

  constructor(private fb: FacebookService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.albumID = this.route.snapshot.paramMap.get('id');
    this.getPhotos();
  }


  getPhotos() {         
    this.fb.api('/'+this.albumID+'/photos?fields=images')
    .then((photos) => {
      console.log(photos);
      if (photos && photos.data && photos.data.length){
        for (let j=0; j<photos.data.length; j++){
          let photo = photos.data[j];
          this.photos.push(photo.images[1]);              
        }
      }
      this.isLoaded = true;
    })
    .catch((error: any) => console.error(error));        
      
  }
  
  SetPhotoSelection(index: number) {
    if(this.photosToExport.includes(this.photos[index])) {
      index = this.photosToExport.indexOf(this.photos[index]);
      this.photosToExport.splice(index, 1);
    }
    else {
      this.photosToExport.push(this.photos[index]);
    }

  }
  
}
