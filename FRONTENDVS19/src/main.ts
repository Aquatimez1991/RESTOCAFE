import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Ajusta la ruta si es necesario
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Ajusta la ruta si es necesario

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
}).catch(err => console.error(err));
