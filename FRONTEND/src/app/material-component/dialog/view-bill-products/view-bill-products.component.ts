import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-view-bill-products',
  standalone: true,
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.scss'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    NgxExtendedPdfViewerModule,
  ]
})
export class ViewBillProductsComponent implements OnInit {
  pdfUrl = '';

  private dialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<ViewBillProductsComponent>>(MatDialogRef);

  ngOnInit(): void {
    this.pdfUrl = this.dialogData?.pdfUrl;
    console.log('PDF URL recibida:', this.pdfUrl);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
