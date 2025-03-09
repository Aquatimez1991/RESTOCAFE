import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewBillProductsComponent } from './view-bill-products.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('ViewBillProductsComponent', () => {
  let component: ViewBillProductsComponent;
  let fixture: ComponentFixture<ViewBillProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBillProductsComponent, MatDialogModule], // ✅ Importamos MatDialogModule
      providers: [
        { provide: MatDialogRef, useValue: {} } // ✅ Mockeamos MatDialogRef
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBillProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
