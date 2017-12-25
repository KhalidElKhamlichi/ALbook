import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FacebookService } from 'ngx-facebook';
import {MatSnackBar} from '@angular/material';

import { UploadFileService } from '../services/upload-file.service';
import { Output } from '@angular/core/src/metadata/directives';
import { Photo } from './../photo';

@Component({
  selector: 'export-photos',
  templateUrl: './export-photos.component.html',
  styleUrls: ['./export-photos.component.css']
})
export class ExportPhotosComponent implements OnInit {

  @Input() photosToExport: Photo[] = [];

  profile = {};

  progress: {percentage: number} = {percentage: 0}; // for progress bar
  ctrSuccess: number = 0;
  ctrFailure: number = 0;

  constructor(private fb: FacebookService, private router: Router, private http: HttpClient, private upSvc: UploadFileService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getProfile();    

  }


  uploadPhotos() {

    this.progress.percentage = 0;
    this.ctrFailure = 0;
    this.ctrSuccess = 0;

    for(let photo of this.photosToExport) {
      this.http.get(photo.source, { responseType: 'blob' }).subscribe((data) => { // use the url to download the photo before uploading it

        let blob: Blob = new Blob([data]);
        let file: File = new File([blob], "image_"+photo.id, { type: "image/jpg"});

        this.upSvc.pushFileToStorage(file, this.profile['name'], this.progress, (success) => {this.onUpload(success)});
      });
    }

  }

  onUpload(success) {
    if(success)
      this.ctrSuccess++;
    else
      this.ctrFailure++;
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


}
