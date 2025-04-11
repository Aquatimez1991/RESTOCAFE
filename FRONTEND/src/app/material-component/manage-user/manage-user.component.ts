import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalConstants } from '../../shared/global-constants';
import { SnackbarService } from '../../services/snackbar.service';
import { UserService } from '../../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSlideToggleModule, MatInputModule, FormsModule, MatCardModule],
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  // --- Servicios ---
  private ngxService = inject(NgxUiLoaderService);
  private userService = inject(UserService);
  private snackbarService = inject(SnackbarService);

  // --- Señales y propiedades ---
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status'];
  private _users = signal<any[]>([]);
  filter = signal<string>('');
  responseMessage = signal<string>('');

  // Computed para aplicar filtro dinámico
  filteredUsers = computed(() => {
    const term = this.filter().trim().toLowerCase();
    return this._users().filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.contactNumber.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.ngxService.start();
    this.loadUsers();
  }

  private handleError(error: any): void {
    const message = error?.error?.message || GlobalConstants.genericError;
    this.responseMessage.set(message);
    this.snackbarService.openSnackBar(message, GlobalConstants.error);
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this._users.set(res);
      },
      error: (err) => {
        this.ngxService.stop();
        this.handleError(err);
      }
    });
  }

  onChange(status: any, id: any): void {
    this.ngxService.start();
    const data = {
      status: status.toString(),
      id
    };

    this.userService.update(data).subscribe({
      next: (res: any) => {
        this.ngxService.stop();
        this.responseMessage.set(res?.message);
        this.snackbarService.openSnackBar(res?.message, 'success');
      },
      error: (err) => {
        this.ngxService.stop();
        this.handleError(err);
      }
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filter.set(value);
  }
}
