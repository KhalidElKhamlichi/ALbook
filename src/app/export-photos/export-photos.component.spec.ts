import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPhotosComponent } from './export-photos.component';

describe('ExportPhotosComponent', () => {
  let component: ExportPhotosComponent;
  let fixture: ComponentFixture<ExportPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
