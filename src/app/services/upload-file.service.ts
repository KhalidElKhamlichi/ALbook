import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';
 
import {FileUpload} from './../file-upload';
 
@Injectable()
export class UploadFileService {
 
  constructor(private db: AngularFireDatabase) {}
 
  private basePath = '/photos';
 
  pushFileToStorage(fileUpload: FileUpload, userId: string, progress: {percentage: number}, onUpload: (success) => void) {

    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${userId}/${fileUpload.file.name}`).put(fileUpload.file, { contentType: "image/jpg"});
 
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot
        progress.percentage += Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
      },
      (error) => {
        // fail
        console.log("upload fail");
        console.log(error);
        onUpload(false);
      },
      () => {
        // success
        console.log("upload success");
        fileUpload.url = uploadTask.snapshot.downloadURL
        fileUpload.name = fileUpload.file.name
        this.saveFileData(fileUpload);
        onUpload(true);
      }
    );
    
  }
 
  private saveFileData(fileUpload: FileUpload) {
    this.db.list(`${this.basePath}/`).push(fileUpload);
  }
}