import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';

import { FirebaseService } from '../services/firebase.service';
import { Photo } from '../models/photo';
import { SocialMediaService } from '../services/social-media.service';

@Component({
  selector: 'export-photos',
  templateUrl: './export-photos.component.html',
  styleUrls: ['./export-photos.component.css']
})
export class ExportPhotosComponent implements OnInit {

  @Input() photosToExport: Photo[] = [];

  username: string;

  uploadProgress: {percentage: number} = {percentage: 0};
  nbrOfSuccessfulUploads: number
  nbrOfFailedUploads: number;

  constructor(private socailMediaService: SocialMediaService, private router: Router, private http: HttpClient,
     private uploadService: FirebaseService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.socailMediaService.fetchFacebookUsername(this.setUsername(), this.rerouteToHome());
  }

  uploadPhotos() {
    this.uploadProgress.percentage = 0;
    this.nbrOfFailedUploads = 0;
    this.nbrOfSuccessfulUploads = 0;

    for(let photo of this.photosToExport) {
      this.http.get(photo.source, { responseType: 'blob' }).subscribe((data) => {
        let file: File = this.createFile(data, photo);
        this.uploadService.pushFileToStorage(file, this.username, (success) => this.onUpload(success),
         (uploadProgressPercentage) => this.updateProgressBar(uploadProgressPercentage));
      });
    }
  }

  private updateProgressBar(progress: number): void {
    this.uploadProgress.percentage += progress;
  }

  private rerouteToHome() {
    return () => this.router.navigate(["/"]);
  }

  private setUsername() {
    return (response: any) => {
      this.username = response;
    };
  }

  private onUpload(success) {
    if(success)
      this.nbrOfSuccessfulUploads++;
    else
      this.nbrOfFailedUploads++;
    if(this.nbrOfSuccessfulUploads + this.nbrOfFailedUploads == this.photosToExport.length)
      this.showSnackBar();
  }

  private showSnackBar(): void {
    this.snackBar.open(this.nbrOfSuccessfulUploads+'/'+this.photosToExport.length+' photos exported')._dismissAfter(2500);
  }

  private createFile(data: Blob, photo: Photo) {
    let blob: Blob = new Blob([data]);
    let file: File = new File([blob], "image_" + photo.id, { type: "image/jpg" });
    return file;
  }

}
