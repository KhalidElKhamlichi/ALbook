import { Component, OnInit, Input } from '@angular/core';
import { Album } from '../models/album';
import { AlbumService } from '../services/album.service';

@Component({
  selector: 'album-card',
  templateUrl: './album-card.component.html',
  styleUrls: ['./album-card.component.css']
})
export class AlbumComponent implements OnInit {

  @Input() album: Album;

  constructor(private albumService: AlbumService) { }

  ngOnInit() {
  }

  setAlbumSource() {
    this.albumService.updateAlbumSource(this.album.source);
  }

}
