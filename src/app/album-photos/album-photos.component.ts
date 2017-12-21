import { FileUpload } from './../file-upload';
import { Component, OnInit } from '@angular/core';
import { FacebookService } from 'ngx-facebook';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UploadFileService } from '../services/upload-file.service';
import {PageEvent} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import { Router } from '@angular/router';

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

  pageEvent: PageEvent = new PageEvent();
  pageIndex: number = 0;
  pageSize: number = 5;
  pageSizeOptions = [5, 10, 25, 100];
  length: number;

  progress: {percentage: number} = {percentage: 0}; // for progress bar
  ctrSuccess: number = 0;
  ctrFailure: number = 0;

  checkAll: boolean = false;

  constructor(private fb: FacebookService, private route: ActivatedRoute, private router: Router, private http: HttpClient, private upSvc: UploadFileService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.albumID = this.route.snapshot.paramMap.get('id');
    this.getProfile();    
    this.getPhotos();
    
    this.pageEvent.pageIndex = this.pageIndex;
    this.pageEvent.pageSize = this.pageSize;
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
      this.length = this.photos.length;
    })
    .catch((error: any) => console.error(error));        
      
  }
  
  setPhotoSelection(index: number) {
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
    this.ctrFailure = 0;
    this.ctrSuccess = 0;
    for(let photo of this.photosToExport) {
      this.http.get(photo['source'], { responseType: 'blob' }).subscribe((data) => { // use the url to download the photo before uploading it
        let blob: Blob = new Blob([data], { type: "image/jpg"});
        let file = new File([blob], "image"+this.photos.indexOf(photo));
        this.upSvc.pushFileToStorage(new FileUpload(file), this.profile['name'], this.progress,  (success) => {this.onUpload(success)});
      });
    }
  }

  onUpload(success) {
    if(success)
      this.ctrSuccess++;
    else
      this.ctrFailure++;
    this.isDone();
  }

  isDone() {
    if(this.ctrSuccess + this.ctrFailure == this.photosToExport.length)
      this.showSnackBar();
  }

  showSnackBar(): void {
    this.snackBar.open(this.ctrSuccess+'/'+this.photosToExport.length+' photos exported')._dismissAfter(2500);
  }

  getProfile(): any {
    this.fb.api('/me')
      .then((res: any) => {
        console.log('Got the users profile', res);
        this.profile = res;
        console.log(this.profile);
      })
      .catch(() => this.router.navigate(["/"]));
  }

  selectAll() {
    this.checkAll = !this.checkAll;
    for(let photo of this.photos) {
      this.setPhotoSelection(this.photos.indexOf(photo));
    } 

    
  }
  
}
