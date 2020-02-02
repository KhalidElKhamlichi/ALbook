import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AlbumSource } from '../models/album-source.enum';

@Injectable()
export class AlbumService {
  
  private albumSource = new BehaviorSubject<AlbumSource>(AlbumSource.Facebook);

  constructor() { }

  getObservableAlbumSource() : Observable<AlbumSource> {
    return this.albumSource.asObservable();
  }

  getCurrentAlbumSource(): AlbumSource {
    return this.albumSource.getValue();
  }
  
  updateAlbumSource(albumSource: AlbumSource) {
    this.albumSource.next(albumSource);
  }

}
