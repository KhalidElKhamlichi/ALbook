import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FacebookService } from 'ngx-facebook';
import {MatSnackBar} from '@angular/material';

import { UploadFileService } from '../services/upload-file.service';
import { Photo } from './../photo';

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

  constructor(private fb: FacebookService, private router: Router, private http: HttpClient,
     private uploadService: UploadFileService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.fb.api('/me')
      .then(this.setUsername())
      .catch(this.rerouteToHome());
  }

  uploadPhotos() {
    this.uploadProgress.percentage = 0;
    this.nbrOfFailedUploads = 0;
    this.nbrOfSuccessfulUploads = 0;

    for(let photo of this.photosToExport) {
      this.http.get(photo.source, { responseType: 'blob' }).subscribe((data) => {
        let file: File = this.createFile(data, photo);
        // debugger
        this.uploadService.pushFileToStorage(file, this.username, (success) => this.onUpload(success),
         (uploadProgressPercentage) => this.updateProgressBar(uploadProgressPercentage));
      });
    }
  }

  updateProgressBar(progress: number): void {
    this.uploadProgress.percentage += progress;
  }

  private rerouteToHome() {
    return () => this.router.navigate(["/"]);
  }

  private setUsername() {
    return (response: any) => {
      this.username = response['name'];
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
