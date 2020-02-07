import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPhotosComponent } from './download-photos.component';

describe('DownloadPhotosComponent', () => {
  let component: DownloadPhotosComponent;
  let fixture: ComponentFixture<DownloadPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
