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
@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent {
  displayedColumns: string[] = ['name', 'edit'];
  dataSource = signal<any>(null); // Usamos signal para reactividad
  responseMessage = signal<string | null>(null);

  // Inyección de dependencias usando `inject`
  private categoryService = inject(CategoryService);
  private ngxService = inject(NgxUiLoaderService);
  private dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);

  constructor() {
    this.ngxService.start(); // Iniciar loader al crear el componente
    this.tableData(); // Cargar categorías
  }

  /**
   * Obtiene las categorías del backend y actualiza la tabla.
   */
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

  /**
   * Filtra la tabla en función del texto ingresado en el input.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const dataSource = this.dataSource();
    if (dataSource) {
      dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  /**
   * Abre el diálogo para agregar una nueva categoría.
   */
  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    };
    dialogConfig.width = "850px"; // Set the width of the dialog
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig); // Open the add category dialog

    // Close the dialog if the user navigates to a different route
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    // Subscribe to the event emitted when a new category is added, and refresh the table data
    dialogRef.componentInstance.onAddCategory.set(true);
    this.tableData();
  }

  /**
   * Abre el diálogo para editar una categoría existente.
   */
  handleEditAction(values: any) {
    this.openCategoryDialog('Edit', values);
  }

  /**
   * Método reutilizable para abrir el diálogo de categorías (Agregar/Editar).
   */
  private openCategoryDialog(action: 'Add' | 'Edit', data?: any) {
    const dialogConfig: MatDialogConfig = {
      width: '850px',
      data: { action, data }
    };
    
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);

    this.router.events.subscribe(() => dialogRef.close());

    dialogRef.componentInstance.onAddCategory.set(true);
    dialogRef.afterClosed().subscribe(() => this.tableData());
  }
}
