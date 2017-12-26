import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';
 
 
@Injectable()
export class UploadFileService {
 
  constructor(private db: AngularFireDatabase) {}
 
  private basePath = '/photos';
 
  pushFileToStorage(file: File, userId: string, progress: {percentage: number}, onUpload: (success) => void) {

    // get a reference to firebase storage
    const storageRef = firebase.storage().ref();
    // upload the file to the specified path
    const uploadTask = storageRef.child(`${this.basePath}/${userId}/${file.name}`).put(file, { contentType: file.type});
 
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot
        // update progress bar
        progress.percentage += Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
      },
      (error) => {
        // fail
        console.log(error);
        onUpload(false);
      },
      () => {
        // success
        onUpload(true);
      }
    );
    
  }
}