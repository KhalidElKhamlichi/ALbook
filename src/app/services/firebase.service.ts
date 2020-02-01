import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';
import { Album } from '../models/album';
 
 
@Injectable()
export class FirebaseService {
 
  readonly basePath = '/photos';
  private storageRef: firebase.storage.Reference;

  constructor(private db: AngularFireDatabase) {}
 
  pushFileToStorage(file: File, userId: string, onUpload: (success) => void, updateProgressBar: (progress: number) => void) {
    this.storageRef = firebase.storage().ref();
    const uploadPath = `${this.basePath}/${userId}/${file.name}`;
    const uploadTask = this.storageRef.child(uploadPath).put(file, { contentType: file.type});
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

  fetchExportedAlbums(userId: string, onSuccess: (album) => void) {
    const downloadPath = `${this.basePath}/${userId}`;
    this.storageRef = firebase.storage().ref(downloadPath);
    this.storageRef.listAll()
    .then(response => onSuccess(response))
    .catch(error => console.error(error));
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