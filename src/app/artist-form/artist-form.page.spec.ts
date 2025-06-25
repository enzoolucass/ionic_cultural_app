import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtistFormPage } from './artist-form.page';

describe('ArtistFormPage', () => {
  let component: ArtistFormPage;
  let fixture: ComponentFixture<ArtistFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
