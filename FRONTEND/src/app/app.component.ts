import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedLoaderModule } from './shared/loader/shared-loader.module';
import { UserService } from './services/user.service'; // ✅ Importar UserService
import { Router } from '@angular/router'; // ✅ Para manejar navegación

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Sigue siendo Standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, SharedLoaderModule]
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.userService.checkToken().subscribe(
        () => {
          console.log('Sesión válida');
        },
        () => {
          console.error('Sesión inválida o expirada');
          sessionStorage.clear();
          this.router.navigate(['/']); // Redirigir al home si no hay sesión válida
        }
      );
    }
  }
}
