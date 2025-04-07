import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { GlobalConstants } from '../../../shared/global-constants';

// Angular Material + core
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class ProductComponent {
  // Signals
  onAddProduct = signal(false);
  onEditProduct = signal(false);
  dialogAction = signal<'Add' | 'Edit'>('Add');
  action = signal<'Add' | 'Update'>('Add');
  responseMessage = signal<string | null>(null);
  categories = signal<any[]>([]);

  productForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductComponent>,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService
  ) {
    // Crear formulario
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required]
    });

    // Detectar si es edición
    if (this.dialogData.action === 'Edit') {
      this.dialogAction.set('Edit');
      this.action.set('Update');
      this.productForm.patchValue(this.dialogData.data);
    }

    // Cargar categorías
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getCategorys().subscribe({
      next: (res: any) => {
        this.categories.set(res);
      },
      error: (err) => this.handleError(err)
    });
  }

  handleSubmit() {
    if (this.dialogAction() === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  private add() {
    const data = this.productForm.value;

    this.productService.add(data).subscribe({
      next: (res: any) => {
        this.dialogRef.close();
        this.onAddProduct.set(true);
        this.responseMessage.set(res.message);
        this.snackbarService.openSnackBar(res.message, 'success');
      },
      error: (err) => this.handleError(err)
    });
  }

  private edit() {
    const data = {
      id: this.dialogData.data.id,
      ...this.productForm.value
    };

    this.productService.update(data).subscribe({
      next: (res: any) => {
        this.dialogRef.close();
        this.onEditProduct.set(true);
        this.responseMessage.set(res.message);
        this.snackbarService.openSnackBar(res.message, 'success');
      },
      error: (err) => this.handleError(err)
    });
  }

  private handleError(error: any) {
    this.dialogRef.close();
    console.error(error);
    const message = error.error?.message || GlobalConstants.genericError;
    this.responseMessage.set(message);
    this.snackbarService.openSnackBar(message, GlobalConstants.error);
  }
}
