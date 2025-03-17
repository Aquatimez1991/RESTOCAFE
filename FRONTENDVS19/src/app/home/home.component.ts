import { Component, OnInit } from '@angular/core';
import { BestSellerComponent } from '../best-seller/best-seller.component';
import { MatIconModule } from '@angular/material/icon'; // ✅ Importado correctamente
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BestSellerComponent, MatIconModule], // ✅ Se agrega MatIconModule
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

constructor(private dialog:MatDialog) { }

ngOnInit(): void {
    
}
signupAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(SignupComponent,dialogConfig);
}

}
