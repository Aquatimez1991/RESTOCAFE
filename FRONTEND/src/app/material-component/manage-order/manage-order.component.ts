import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { SnackbarService } from '../../services/snackbar.service';
import { BillService } from '../../services/bill.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../../shared/global-constants';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-manage-order',
  standalone: true,
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule
  ]
})
export class ManageOrderComponent {
  // --- Services ---
  private formBuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private snackbarService = inject(SnackbarService);
  private billService = inject(BillService);
  private ngxService = inject(NgxUiLoaderService);

  // --- Signals ---
  categories = signal<any[]>([]);
  products = signal<any[]>([]);
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource = signal<{ id: number; name: string; category: string; description?: string; quantity: number; price: number; total: number }[]>([]);
  totalAmount = signal<number>(0);
  responseMessage = signal<string | null>(null);
  price = signal<number>(0);

  manageOrderForm: any  = this.formBuilder.group({
    name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
    email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
    contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
    paymentMethod: [null, [Validators.required]],
    product: [null, [Validators.required]],
    category: [null, [Validators.required]],
    quantity: [1, [Validators.required]],  // ← cantidad ahora empieza en 1
    price: [0, [Validators.required]],     // ← precio ahora empieza en 0
    total: [0, [Validators.required]]
  });



  constructor() {
    this.ngxService.start();
    this.getCategories();

    effect(() => {
      const quantity = this.manageOrderForm.controls['quantity'].value;
      const unitPrice = this.manageOrderForm.controls['price'].value;
      if (quantity && unitPrice) {
        this.manageOrderForm.controls['total'].setValue(quantity * unitPrice, { emitEvent: false });
      }
    });
  }

  private handleError(error: any) {
    console.error(error);
    this.responseMessage.set(error.error?.message || GlobalConstants.genericError);
    this.snackbarService.openSnackBar(this.responseMessage() || '', GlobalConstants.error);
  }

  getCategories() {
    this.categoryService.getFilteredCategories().subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.categories.set(res);
      },
      error: (err: any) => {
        this.ngxService.stop();
        this.handleError(err);
      }
    });
  }

  getProductByCategory(category: any) {
    this.productService.getProductsByCategory(category.id).subscribe({
      next: (res: any) => {
        this.products.set(res);
        this.manageOrderForm.patchValue({ price: 0, quantity: 1, total: 0 });
      },
      error: (err: any) => {
        this.ngxService.stop();
        this.handleError(err);
      }
    });
  }

  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe((response: any) => {
      const productData = response.data;
      this.price.set(productData.price);
      this.manageOrderForm.controls['price'].setValue(productData.price);
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(productData.price * 1);
    }, (error: any) => {
      this.ngxService.stop();
      this.handleError(error);
    });
    
  }
  

  setQuantity(value: any) {
    // Retrieve the current value of the quantity control from the form
    let temp = this.manageOrderForm.controls['quantity'].value;

    // Check if the entered quantity is greater than 0
    if (temp > 0) {
      // Calculate and update the total based on the quantity and price
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value
      );
    } else if (temp != '') {
      // If the quantity is not valid (e.g., negative or zero), reset it to 1
      this.manageOrderForm.controls['quantity'].setValue('1');
      // Recalculate and update the total based on the reset quantity and price
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value
      );
    }
  }
  

  validateProductAdd(): boolean {
    const { total, quantity } = this.manageOrderForm.value;
    return total === 0 || total === null || quantity! <= 0;
  }

  validateSubmit(): boolean {
    const { name, email, contactNumber, paymentMethod } = this.manageOrderForm.value;
    return this.totalAmount() === 0 || !name || !email || !contactNumber || !paymentMethod;
  }

  add() {
    const formData = this.manageOrderForm.value;
    
    console.log('Form Data:', formData); // Depuración para verificar los valores
    
    const productName = this.dataSource().find((p: { id: number; }) => p.id === formData.product.id);
    if (productName === undefined) {
      this.totalAmount.set(this.totalAmount() + formData.total!);
  
      const newData = [
        ...this.dataSource(),
        {
          id: formData.product.id,
          name: formData.product.name,
          category: formData.category.name,
          quantity: formData.quantity,
          price: formData.price,
          total: formData.total
        }
      ];
  
      this.dataSource.set(newData);
      this.snackbarService.openSnackBar(GlobalConstants.productAdded, 'success');
    } else {
      this.snackbarService.openSnackBar(GlobalConstants.productExistsError, GlobalConstants.error);
    }
  }

  handleDeleteAction(index: any, element: any) {
    const updatedData = [...this.dataSource()];
    updatedData.splice(index, 1);
    this.totalAmount.set(this.totalAmount() - element.total);
    this.dataSource.set(updatedData);
  }

  submitAction() {
    const formData = this.manageOrderForm.value;
  
    const data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount(),
      productDetails: JSON.stringify(
        this.dataSource().map((product: any) => ({
          id: product.id,
          name: product.name,
          category: product.category.name ?? product.category,
          quantity: product.quantity,
          price: product.price,
          total: product.total
        }))
      )
    };
  
    this.ngxService.start();
    this.billService.generateReport(data).subscribe({
      next: (res: any) => {
        const uuid = res?.uuid;
        if (uuid) {
          this.downloadFile(uuid, data.name); 
          this.dataSource.set([]);
          this.totalAmount.set(0);
          this.manageOrderForm.reset();
        } else {
          this.handleError({ error: { message: 'UUID no recibido del servidor' } });
        }
      },
      error: (err) => {
        this.ngxService.stop();
        this.handleError(err);
      }
    });
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
