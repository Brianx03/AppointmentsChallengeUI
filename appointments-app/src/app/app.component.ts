import { Component } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './app.component.html'
  ,
  styles: [`
    .container { display: flex; }
    .content { margin-left: 200px; padding: 20px; width: 100%; }
  `]
})
export class AppComponent { }
