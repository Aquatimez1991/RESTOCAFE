import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

interface LoginResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogContent,
    MatDialogActions
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  responseMessage: string = '';
  hide: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]
      ],
      password: [null, Validators.required]
    });
  }

  handleSubmit() {
    if (this.loginForm.invalid) return;
    this.ngxService.start();
    const formData = this.loginForm.value;
    const data = {
      email: formData.email,
      password: formData.password
    };
    
    this.userService.login(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        sessionStorage.setItem('token', response.token);
        this.router.navigate(['/cafe/dashboard']);
      },
      (error) => {
        this.ngxService.stop();
        this.responseMessage = error?.error?.message || "Ocurrió un error inesperado. Inténtalo nuevamente.";
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
}