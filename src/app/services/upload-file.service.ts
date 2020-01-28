import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';
 
 
@Injectable()
export class UploadFileService {
 
  constructor(private db: AngularFireDatabase) {}
 
  readonly basePath = '/photos';
 
  pushFileToStorage(file: File, userId: string, onUpload: (success) => void, updateProgressBar: (progress: number) => void) {
    const storageRef = firebase.storage().ref();
    debugger
    const uploadPath = `${this.basePath}/${userId}/${file.name}`;
    const uploadTask = storageRef.child(uploadPath).put(file, { contentType: file.type});
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        const snap = snapshot as firebase.storage.UploadTaskSnapshot
        const uploadPercentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        updateProgressBar(uploadPercentage);
      },
      this.onError(onUpload),
      this.onComplete(onUpload)
    );
    
  }

  private onComplete(onUpload: (success: any) => void): firebase.Unsubscribe {
    return () => {
      onUpload(true);
    };
  }

  private onError(onUpload: (success) => void): (a: Error) => any {
    return (error) => {
      console.log(error);
      onUpload(false);
    };
  }
}