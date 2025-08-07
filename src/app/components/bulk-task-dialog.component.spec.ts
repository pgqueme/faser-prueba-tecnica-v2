import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkTaskDialogComponent } from './bulk-task-dialog.component';

describe('BulkTaskDialogComponent', () => {
  let component: BulkTaskDialogComponent;
  let fixture: ComponentFixture<BulkTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkTaskDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
