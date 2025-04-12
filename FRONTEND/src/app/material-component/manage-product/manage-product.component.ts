import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../../services/product.service';
import { SnackbarService } from '../../services/snackbar.service';
import { GlobalConstants } from '../../shared/global-constants';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-manage-product',
  standalone: true,
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatSlideToggleModule
  ]
})
export class ManageProductComponent {
  displayedColumns: string[] = ['name', 'categoryName', 'description', 'price', 'edit'];
  dataSource = signal<any>(null);
  responseMessage = signal<string | null>(null);

  private productService = inject(ProductService);
  private ngxService = inject(NgxUiLoaderService);
  private dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);

  constructor() {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.dataSource.set(new MatTableDataSource(res));
      },
      error: (error: any) => {
        this.ngxService.stop();
        this.responseMessage.set(error?.error?.message || GlobalConstants.genericError);
        this.snackbarService.openSnackBar(this.responseMessage() || '', GlobalConstants.error);
      }
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const ds = this.dataSource();
    if (ds) {
      ds.filterPredicate = (data: any, filter: string): boolean => {
        const combinedStr =
          (data.name ?? '') +
          (data.categoryName ?? '') +
          (data.description ?? '') +
          (data.price?.toString() ?? '') +
          (data.status ? 'activo' : 'inactivo');

          
        return combinedStr.toLowerCase().includes(filter);
      };
      ds.filter = value;
    }
  }
  
  handleAddAction() {
    this.openProductDialog('Add');
  }

  handleEditAction(data: any) {
    this.openProductDialog('Edit', data);
  }

  private openProductDialog(action: 'Add' | 'Edit', data?: any) {
    const dialogConfig: MatDialogConfig = {
      width: '850px',
      data: { action, data }
    };

    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => dialogRef.close());

    dialogRef.afterClosed().subscribe(() => {
      const added = dialogRef.componentInstance.onAddProduct();
      const edited = dialogRef.componentInstance.onEditProduct();

      if (added || edited) {
        this.tableData();
      }
    });
  }

  handleDeleteAction(product: any) {
    const dialogConfig: MatDialogConfig = {
      data: {
        message: `delete ${product.name} product`,
        confirmation: true
      }
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    dialogRef.componentInstance.onEmitStatusChange.subscribe(() => {
      this.ngxService.start();
      this.deleteProduct(product.id);
      dialogRef.close();
    });
  }

  deleteProduct(id: number) {
    this.productService.delete(id).subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.responseMessage.set(res?.message);
        this.snackbarService.openSnackBar(res?.message, 'success');
        this.tableData();
      },
      error: (error: any) => {
        this.ngxService.stop();
        this.responseMessage.set(error?.error?.message || GlobalConstants.genericError);
        this.snackbarService.openSnackBar(this.responseMessage() || '', GlobalConstants.error);
      }
    });
  }

  onChange(status: boolean, id: number) {
    this.ngxService.start();
    const payload = { status: status.toString(), id };

    this.productService.updateStatus(payload).subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.responseMessage.set(res.message);
        this.snackbarService.openSnackBar(res.message, 'success');
      },
      error: (error: any) => {
        this.ngxService.stop();
        this.responseMessage.set(error?.error?.message || GlobalConstants.genericError);
        this.snackbarService.openSnackBar(this.responseMessage() || '', GlobalConstants.error);
      }
    });
  }
}
