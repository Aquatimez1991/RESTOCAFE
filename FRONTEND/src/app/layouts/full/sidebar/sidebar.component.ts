import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { jwtDecode } from 'jwt-decode';
import { MenuItems } from '../../../shared/menu-items';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [MenuItems], // ✅ Asegurar que está en providers
  imports: [
    MatListModule,
    MatIconModule,
    RouterModule,
    CommonModule,
  ],
})
export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  userRole: any;
  token: any = sessionStorage.getItem('token');
  tokenPayload: any;

  private _mobileQueryListener: () => void;

  // ✅ Se inyecta correctamente `MenuItems`
  private changeDetectorRef = inject(ChangeDetectorRef);
  private media = inject(MediaMatcher);
  public menuItemsService = inject(MenuItems); // ✅ Cambio de nombre para evitar confusión

  public menuItems: any[] = []; // ✅ Inicializar array vacío

  constructor() {
    this.tokenPayload = jwtDecode(this.token);
    this.userRole = this.tokenPayload?.role;

    this.mobileQuery = this.media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    // ✅ Verifica que `getMenuItems()` existe antes de llamarlo
    if (this.menuItemsService && typeof this.menuItemsService.getMenuItems === 'function') {
      this.menuItems = this.menuItemsService.getMenuItems();
    } else {
      console.error('Error: getMenuItems() no está definido en MenuItems.');
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

