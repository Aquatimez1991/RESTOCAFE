import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';


@Component({
  selector: 'app-view-bill-products',
  standalone: true,
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatGridListModule,

  ]
})
export class ViewBillProductsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total'];
  dataSource: any;
  data: any;

  private dialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<ViewBillProductsComponent>>(MatDialogRef);

  ngOnInit(): void {
    this.data = this.dialogData.data;
    try {
      this.dataSource = this.data.productDetails ?? [];

    } catch (error) {
      console.error('Error parsing BillProducts JSON', error);
      this.dataSource = [];
    }
    console.log(this.data);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
