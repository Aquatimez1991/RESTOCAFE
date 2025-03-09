import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Se mantiene como Standalone Component
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule] // Asegúrate de importar RouterModule aquí
})
export class AppComponent {
  title = 'frontend';
}
