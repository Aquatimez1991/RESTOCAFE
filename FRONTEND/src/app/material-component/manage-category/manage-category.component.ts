import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../services/category.service';
import { SnackbarService } from '../../services/snackbar.service';
import { GlobalConstants } from '../../shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTooltipModule, MatButtonModule],
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent {
  displayedColumns: string[] = ['name', 'edit'];
  dataSource = signal<any>(null); 
  responseMessage = signal<string | null>(null);


  private categoryService = inject(CategoryService);
  private ngxService = inject(NgxUiLoaderService);
  private dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);

  constructor() {
    this.ngxService.start(); 
    this.tableData();
  }

  tableData() {
    this.categoryService.getCategorys().subscribe({
      next: (response:any) => {
        this.ngxService.stop();
        this.dataSource.set(new MatTableDataSource(response));
      },
      error: (error:any) => {
        this.ngxService.stop();
        this.responseMessage=error.error?.message || GlobalConstants.genericError;
        this.snackbarService.openSnackBar(this.responseMessage() || '', GlobalConstants.error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const ds = this.dataSource();
  
    if (ds) {
      
      ds.filterPredicate = (data: any, filter: string): boolean => {
        const str = `${data.name} ${data.description}`.toLowerCase();
        return str.includes(filter);
      };
      
      ds.filter = filterValue;
    }
  }
  
  handleAddAction() {
    this.openCategoryDialog('Add');
  }
  
  handleEditAction(values: any) {
    this.openCategoryDialog('Edit', values);
  }

  private openCategoryDialog(action: 'Add' | 'Edit', data?: any) {
    const dialogConfig: MatDialogConfig = {
      width: '850px',
      data: { action, data }
    };
  
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
  
    this.router.events.subscribe(() => dialogRef.close());
  
    dialogRef.afterClosed().subscribe(() => {
      const added = dialogRef.componentInstance.onAddCategory();
      const edited = dialogRef.componentInstance.onEditCategory();
  
      if (added || edited) {
        this.tableData(); 
      }
    });
  }
  
}
