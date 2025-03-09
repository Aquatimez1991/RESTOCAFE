import { Component } from '@angular/core';
import { BestSellerComponent } from '../best-seller/best-seller.component';
import { MatIconModule } from '@angular/material/icon'; // ✅ Importado correctamente

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BestSellerComponent, MatIconModule], // ✅ Se agrega MatIconModule
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
