import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { GlobalConstants } from '../../../shared/global-constants';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';


import { CommonModule } from '@angular/common';
import { update } from 'node_modules/cypress/types/lodash';

@Component({
  selector: 'app-category',
  standalone: true,
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  imports: [
   
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    ReactiveFormsModule, 
    CommonModule 
  ]
})
export class CategoryComponent {
  onAddCategory = signal(false); 
  onEditCategory = signal(false); 
  categoryForm: FormGroup;
  dialogAction = signal<'Add' | 'Edit'>('Add'); 
  action = signal<'Add' | 'Update'>('Add'); 
  responseMessage = signal<string | null>(null); 

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryComponent>,
    private snackbarService: SnackbarService
  ) {
   
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]],
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction.set('Edit');
      this.action.set('Update');
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

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
      },
    });
  }

  edit() {
    const data = {
      id: this.dialogData.data.id,
      name: this.categoryForm.value.name,
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
      },
    });
  }

  handleSubmit() {
    if (this.dialogAction() === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  private handleError(error: any) {
    this.dialogRef.close();
    console.error(error);
    const message = error.error?.message || GlobalConstants.genericError;
    this.responseMessage.set(message);
    this.snackbarService.openSnackBar(message, GlobalConstants.error);
  }

  translateAction(action: string): string {
    const translations: { [key: string]: string } = {
      add: 'Agregar',
      edit: 'Editar',
      delete: 'Eliminar',
      save: 'Actualizar', 
      update: 'Actualizar',
    };
  
    return translations[action.toLowerCase()] || action;
  }
}
