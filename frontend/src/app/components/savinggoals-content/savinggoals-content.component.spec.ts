import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavinggoalsContentComponent } from './savinggoals-content.component';

describe('SavinggoalsContentComponent', () => {
  let component: SavinggoalsContentComponent;
  let fixture: ComponentFixture<SavinggoalsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavinggoalsContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavinggoalsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
