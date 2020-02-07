import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { FirebaseService } from '../services/firebase.service';
import { Photo } from '../models/photo';
import { SocialMediaService } from '../services/social-media.service';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'export-photos',
  templateUrl: './export-photos.component.html',
  styleUrls: ['./export-photos.component.css']
})
export class ExportPhotosComponent implements OnInit {

  @Input() photosToExport: Photo[] = [];
  @ViewChild(ProgressBarComponent) progressBar: ProgressBarComponent;

  username: string;

  constructor(private socailMediaService: SocialMediaService, private router: Router, private http: HttpClient,
    private uploadService: FirebaseService) { }

  ngOnInit() {
    this.socailMediaService.fetchFacebookUsername(this.setUsername(), this.rerouteToHome());
  }

  uploadPhotos() {
    this.progressBar.init(this.photosToExport.length);

    for (let photo of this.photosToExport) {
      this.http.get(photo.source, { responseType: 'blob' }).subscribe((data) => {
        let file: File = this.createFile(data, photo);
        this.uploadService.pushFileToStorage(file, this.username, (success) => this.progressBar.onUpload(success),
          (uploadProgressPercentage) => this.progressBar.updateProgressBar(uploadProgressPercentage/this.photosToExport.length));
      });
    }
  }
  
  private setUsername() {
    return (response: any) => {
      this.username = response;
    };
  }

  private createFile(data: Blob, photo: Photo) {
    let blob: Blob = new Blob([data]);
    let file: File = new File([blob], "image_" + photo.id, { type: "image/jpg" });
    return file;
  }

  private rerouteToHome() {
    return () => this.router.navigate(["/"]);
  }

}
