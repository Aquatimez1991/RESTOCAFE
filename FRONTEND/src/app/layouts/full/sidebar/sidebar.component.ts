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

  private changeDetectorRef = inject(ChangeDetectorRef);
  private media = inject(MediaMatcher);
  public MenuItems= inject(MenuItems);

  constructor() {
    this.tokenPayload = jwtDecode(this.token);
    this.userRole = this.tokenPayload?.role;
    this.mobileQuery = this.media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

