import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedLoaderModule } from './shared/loader/shared-loader.module';
import { UserService } from './services/user.service'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone: true, 
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
          this.router.navigate(['/']); 
        }
      );
    }
  }
}
