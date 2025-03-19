import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader'; // ✅ Importar módulo y servicio

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  styleUrls: ['./reset-password.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService // 🔹 Inyección del servicio de loader
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) return;

    const { newPassword, confirmPassword } = this.resetPasswordForm.value;
    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.ngxLoader.start(); // 🔄 Iniciar loader antes de la solicitud

    this.userService.resetPassword({ token: this.token, newPassword })
      .subscribe(
        (response: any) => {
          this.successMessage = response.message;
          this.ngxLoader.stop(); // ⏹️ Detener loader al recibir la respuesta
          setTimeout(() => this.router.navigate(['/login']), 4200);
        },
        (error) => {
          this.errorMessage = error.error.message || 'Error al actualizar la contraseña.';
          this.ngxLoader.stop(); // ⏹️ Detener loader en caso de error
        }
      );
  }
}
