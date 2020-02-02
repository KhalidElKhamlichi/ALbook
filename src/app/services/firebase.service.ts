import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';
import { Album } from '../models/album';
import { Photo } from '../models/photo';
import { AlbumSource } from '../models/album-source.enum';
 
 
@Injectable()
export class FirebaseService {  
 
  readonly basePath = '/photos';
  private storageRef: firebase.storage.Reference;
  private downloadPath: string;

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
      (error) => {
        console.error(error);
        onUpload(false)},
      () => onUpload(true)
    );
  }

  fetchExportedAlbum(userId: string, onSuccess: (album) => void) {
    this.downloadPath = `${this.basePath}/${userId}`;
    this.storageRef = firebase.storage().ref(this.downloadPath);
    this.storageRef.listAll()
    .then(response => {
      this.storageRef = firebase.storage().ref(response.items[0].fullPath);
      this.storageRef.getDownloadURL().then(url => {
        let coverPhoto: Photo = new Photo(response.items[0].name, url);
        let album: Album = new Album("0", "Firebase", coverPhoto, response.items.length, AlbumSource.Firebase);
        onSuccess(album);
      }).catch(console.error);      
    })
    .catch(console.error);
  }

  fetchPhotos(onSuccess: (photo: Photo) => void) {
    this.storageRef = firebase.storage().ref(this.downloadPath);
    this.storageRef.listAll()
    .then(response => {
      response.items.forEach(item => {
        this.storageRef = firebase.storage().ref(item.fullPath);
        this.storageRef.getDownloadURL().then(url => {
          let photo: Photo = new Photo(item.name, url);
          onSuccess(photo);
        })
        .catch(console.error);  
      });          
    })
    .catch(console.error);
  }

  // private onComplete(onUpload: (success: any) => void): firebase.Unsubscribe {
  //   return () => {
  //     onUpload(true);
  //   };
  // }

  // private onError(onUpload: (success) => void): (a: Error) => any {
  //   return (error) => {
  //     onUpload(false);
  //   };
  // }
}