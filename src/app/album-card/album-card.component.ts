import { Component, OnInit, Input } from '@angular/core';
import { Album } from '../album';
import { Router } from '@angular/router';

@Component({
  selector: 'album-card',
  templateUrl: './album-card.component.html',
  styleUrls: ['./album-card.component.css']
})
export class AlbumComponent implements OnInit {

  @Input() album: Album;

  constructor(private router: Router) { }

  ngOnInit() {
  }


}
