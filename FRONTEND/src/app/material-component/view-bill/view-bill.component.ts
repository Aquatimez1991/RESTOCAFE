import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillService } from '../../services/bill.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GlobalConstants } from '../../shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-view-bill',
  standalone: true,
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    RouterModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class ViewBillComponent {
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view'];
  dataSource = signal<any>(null);
  responseMessage = signal<string | null>(null);

  private billService = inject(BillService);
  private ngxService = inject(NgxUiLoaderService);
  private dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);

  constructor() {
    this.ngxService.start();
    this.tableData();
  }

  private handleError(error: any) {
    const message = error?.error?.message || GlobalConstants.genericError;
    this.responseMessage.set(message);
    this.snackbarService.openSnackBar(message, GlobalConstants.error);
  }

  tableData() {
    this.billService.getBills().subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.dataSource.set(new MatTableDataSource(res));
      },
      error: (err: any) => {
        this.ngxService.stop();
        this.handleError(err);
      }
    });
  }

  applyFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filterValue = input?.value?.trim().toLowerCase() || '';
    const dataSource = this.dataSource();
  
    if (!dataSource) return;
  
    dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const combined = [
        data.name,
        data.email,
        data.contactNumber,
        data.paymentMethod,
        data.total?.toString(),
        data.uuid,
        data.createdBy
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
  
      return combined.includes(filter);
    };
  
    dataSource.filter = filterValue;
  }

  handleViewAction(data: any) {
    this.ngxService.start();
  
    this.billService.getPdf({ uuid: data.uuid }).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);
  
        const dialogConfig: MatDialogConfig = {
          width: '80%',
          height: '90%',
          data: {
            pdfUrl 
          }
        };
  
        const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
        this.router.events.subscribe(() => dialogRef.close());
        this.ngxService.stop();
      },
      error: (err) => {
        this.ngxService.stop();
        this.handleError(err);
      }
    });
  }

  handleDeleteAction(data: any) {
    const dialogConfig: MatDialogConfig = {
      data: {
        message: `delete "${data.name}" bill?`,
        confirmation: true
      }
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    dialogRef.componentInstance.onEmitStatusChange.subscribe(() => {
      this.ngxService.start();
      this.deleteBill(data.uuid);
      dialogRef.close();
    });
  }

  deleteBill(id: string) {
    this.billService.delete(id).subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.responseMessage.set(res?.message);
        this.snackbarService.openSnackBar(res?.message, 'success');
        this.tableData();
      },
      error: (err: any) => {
        this.ngxService.stop();
        this.handleError(err);
      }
    });
  }

  downloadReportAction(data: any) {
    this.ngxService.start();

    const products = Array.isArray(data.productDetails)
      ? data.productDetails.map((p: any) => ({
          id: p.id,
          name: p.name,
          categoryId: p.categoryId,
          description: p.description,
          price: p.price
        }))
      : [];

    const payload = {
      Bill: {
        name: data.name,
        email: data.email,
        contactNumber: data.contactNumber,
        paymentMethod: data.paymentMethod,
        totalAmount: data.totalAmount
      },
      Products: products
    };

    this.downloadFile(data.uuid, data.name);
  }

  downloadFile(uuid: string, name: string) {
    this.billService.getPdf({ uuid }).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${name}.pdf`;
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.ngxService.stop();
      },
      error: (err) => {
        this.ngxService.stop();
        this.handleError(err);
      }
    });
  }
}
