import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgIf } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router'; // ✅ Importado correctamente
import { HeaderComponent } from '../full/header/header.component';
import { SidebarComponent } from '../full/sidebar/sidebar.component';

@Component({
  selector: 'app-full-layout',
  standalone: true,
  imports: [
    NgIf,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    RouterOutlet, // ✅ Se agrega aquí
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent {
  isMobile: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }
}
