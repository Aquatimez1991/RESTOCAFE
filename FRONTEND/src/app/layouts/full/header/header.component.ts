import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig, MatDialogModule } from "@angular/material/dialog";
import { ConfirmationComponent } from "../../../material-component/dialog/confirmation/confirmation.component";
import { ChangePasswordComponent } from "../../../material-component/dialog/change-password/change-password.component";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatMenuModule]
})
export class AppHeaderComponent {
  role: any;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }

  logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Logout',
      confirmation: true
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      dialogRef.close();
      sessionStorage.clear();
      this.router.navigate(['/']);
    });
  }

  changePassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }
}
