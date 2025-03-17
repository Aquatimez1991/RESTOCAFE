import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedLoaderModule } from './shared/loader/shared-loader.module';
@Component({
  selector: 'app-root',
  standalone: true, // ✅ Se mantiene como Standalone Component
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, SharedLoaderModule] 
})
export class AppComponent {
  title = 'frontend';
}
