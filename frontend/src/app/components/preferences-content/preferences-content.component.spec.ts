import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesContentComponent } from './preferences-content.component';

describe('PreferencesContentComponent', () => {
  let component: PreferencesContentComponent;
  let fixture: ComponentFixture<PreferencesContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferencesContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
