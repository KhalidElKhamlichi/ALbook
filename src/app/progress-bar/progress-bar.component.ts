import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

  uploadProgress: { percentage: number } = { percentage: 0 };
  nbrOfSuccessfulUploads: number
  nbrOfFailedUploads: number;
  nbrOfPhotos: number;

  constructor(public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  updateProgressBar(progress: number): void {
    this.uploadProgress.percentage += progress;
  }

  onUpload(success) {
    if (success)
      this.nbrOfSuccessfulUploads++;
    else
      this.nbrOfFailedUploads++;
    if (this.nbrOfSuccessfulUploads + this.nbrOfFailedUploads == this.nbrOfPhotos)
      this.showSnackBar();
  }

  init(nbrOfPhotos) {
    this.nbrOfPhotos = nbrOfPhotos;
    this.uploadProgress.percentage = 0;
    this.nbrOfFailedUploads = 0;
    this.nbrOfSuccessfulUploads = 0;
  }

  private showSnackBar(): void {
    this.snackBar.open(this.nbrOfSuccessfulUploads + '/' + this.nbrOfPhotos + ' photos exported')._dismissAfter(2500);
  }
}
