import { Component, Inject, Signal, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { GlobalConstants } from '../../../shared/global-constants';

@Component({
  selector: 'app-category',
  standalone: true,
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  imports: [
    // Aquí puedes importar Angular Material y otros módulos necesarios
  ]
})
export class CategoryComponent {

  onAddCategory = signal(false);  // Signal en lugar de EventEmitter
  onEditCategory = signal(false); // Signal en lugar de EventEmitter
  categoryForm: FormGroup;
  dialogAction = signal<'Add' | 'Edit'>('Add'); // Signal con el estado de la acción
  action = signal<'Add' | 'Update'>('Add'); // Label para UI
  responseMessage = signal<string | null>(null); // Mensaje de respuesta

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryComponent>,
    private snackbarService: SnackbarService
  ) {
    // Inicializar el formulario reactivo
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]]
    });

    // Si el modal es de edición, precargar datos
    if (this.dialogData.action === 'Edit') {
      this.dialogAction.set('Edit');
      this.action.set('Update');
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  /**
   * Maneja la adición de una nueva categoría.
   */
  add() {
    const data = { name: this.categoryForm.value.name };

    this.categoryService.add(data).subscribe({
      next: (response: any) => {
        this.dialogRef.close();
        this.onAddCategory.set(true);
        this.responseMessage.set(response.message);
        this.snackbarService.openSnackBar(response.message, 'success');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  /**
   * Maneja la edición de una categoría existente.
   */
  edit() {
    const data = {
      id: this.dialogData.data.id,
      name: this.categoryForm.value.name
    };

    this.categoryService.update(data).subscribe({
      next: (response: any) => {
        this.dialogRef.close();
        this.onEditCategory.set(true);
        this.responseMessage.set(response.message);
        this.snackbarService.openSnackBar(response.message, 'success');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  /**
   * Maneja la presentación del formulario y decide si agregar o editar.
   */
  handleSubmit() {
    if (this.dialogAction() === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  /**
   * Maneja errores y muestra mensajes adecuados.
   */
  private handleError(error: any) {
    this.dialogRef.close();
    console.error(error);
    const message = error.error?.message || GlobalConstants.genericError;
    this.responseMessage.set(message);
    this.snackbarService.openSnackBar(message, GlobalConstants.error);
  }
}
