import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { UserComponent } from './app/pages/user/user.component';
import { ManagerComponent } from './app/pages/manager/manager.component';
import { provideHttpClient } from '@angular/common/http';


const routes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'manager', component: ManagerComponent },
  { path: '', redirectTo: 'user', pathMatch: 'full' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});