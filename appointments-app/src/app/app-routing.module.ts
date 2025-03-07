import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './pages/user/user.component';
import { ManagerComponent } from './pages/manager/manager.component';

const routes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'manager', component: ManagerComponent },
  { path: '', redirectTo: '/user', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }