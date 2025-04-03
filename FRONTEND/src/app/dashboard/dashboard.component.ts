import { Component, OnInit } from '@angular/core';
import { DashboardService } from "../services/dashboard.service";
import { SnackbarService } from "../services/snackbar.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { GlobalConstants } from "../shared/global-constants";
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule
  ],
})
export class DashboardComponent implements OnInit {
  responseMessage: any;
  data: any;

  constructor(
    private dashboardService: DashboardService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.ngxService.start(); 
    this.dashboardData(); 
  }

  dashboardData() {
    this.dashboardService.getDetails().subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.data = response; 
      },
      error: (error: any) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericError;
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });
  }
}
