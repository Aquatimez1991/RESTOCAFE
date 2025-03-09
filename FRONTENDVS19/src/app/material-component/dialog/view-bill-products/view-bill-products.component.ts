import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-bill-products',
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.css']
})
export class ViewBillProductsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ViewBillProductsComponent>) {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
