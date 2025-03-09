import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Se mantiene como Standalone Component
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
