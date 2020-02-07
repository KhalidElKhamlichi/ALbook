import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FirebaseService } from '../services/firebase.service';
import { Photo } from '../models/photo';
import { Observable } from 'rxjs/Observable';
import * as JSZip from 'jszip';
import {saveAs} from 'file-saver';


@Component({
  selector: 'download-photos',
  templateUrl: './download-photos.component.html',
  styleUrls: ['./download-photos.component.css']
})
export class DownloadPhotosComponent implements OnInit {

  @Input() photosToExport: Photo[] = [];
  @ViewChild(ProgressBarComponent) progressBar: ProgressBarComponent;

  username: string;
  files: Blob[] = [];

  constructor(private router: Router, private http: HttpClient,
    private uploadService: FirebaseService) { }

  ngOnInit() {}

  downloadPhotos() {
    this.progressBar.init(this.photosToExport.length);
    var getPhotoObservables: Observable<Blob>[] = this.fetchPhotos();
    
    Observable.forkJoin(getPhotoObservables).subscribe(this.generateZip());   
  }

  private fetchPhotos() {
    var getPhotoObservables: Observable<Blob>[] = [];
    for (let photo of this.photosToExport) {
      getPhotoObservables.push(this.http.get(photo.source, { responseType: 'blob' }));
    }
    return getPhotoObservables;
  }

  private generateZip(): (value: Blob[]) => void {
    return (photos) => {
      let zip: JSZip = new JSZip();
      photos.forEach(photo => zip.file("photo" + photo.size + ".jpg", photo));
      zip.generateAsync({ type: "blob" }).then((file) => saveAs(file, "photos.zip"));
    };
  }

}
