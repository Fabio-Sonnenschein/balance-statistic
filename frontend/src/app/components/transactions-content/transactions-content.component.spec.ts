import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsContentComponent } from './transactions-content.component';

describe('TransactionsContentComponent', () => {
  let component: TransactionsContentComponent;
  let fixture: ComponentFixture<TransactionsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionsContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
