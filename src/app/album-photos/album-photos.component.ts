import { FileUpload } from './../file-upload';
import { Component, OnInit } from '@angular/core';
import { FacebookService } from 'ngx-facebook';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UploadFileService } from '../services/upload-file.service';

@Component({
  selector: 'album-photos',
  templateUrl: './album-photos.component.html',
  styleUrls: ['./album-photos.component.css']
})
export class AlbumPhotosComponent implements OnInit {

  isLoaded: boolean = false; // have the photos been loaded
  profile = {};
  albumID: string;
  photos: any[] = [];
  photosToExport: any[] = [];

  progress: {percentage: number} = {percentage: 0}; // for progress bar

  constructor(private fb: FacebookService, private route: ActivatedRoute, private http: HttpClient, private upSvc: UploadFileService) { }

  ngOnInit() {
    this.albumID = this.route.snapshot.paramMap.get('id');
    this.getPhotos();
    this.getProfile();
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

  uploadPhotos() {
    this.progress.percentage = 0;
    for(let photo of this.photosToExport) {
      this.http.get(photo['source'], { responseType: 'blob' }).subscribe((data) => { // use the url to download the photo before uploading it
        let blob: Blob = new Blob([data], { type: "image/jpg"});
        let file = new File([blob], "image"+this.photos.indexOf(photo));
        this.upSvc.pushFileToStorage(new FileUpload(file), this.profile['name'], this.photosToExport.length, this.progress);
      });
    }
  }

  getProfile(): any {
    this.fb.api('/me')
      .then((res: any) => {
        console.log('Got the users profile', res);
        this.profile = res;
        console.log(this.profile);
      })
      .catch();
  }
  
}
