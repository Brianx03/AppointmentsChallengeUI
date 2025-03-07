import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ManagerService } from '../../services/manager.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [ 
    CommonModule,
        MatTableModule,
        FormsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatInputModule,
        MatNativeDateModule,
        MatDialogModule,
        MatSortModule,
  ],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
})
export class ManagerComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort; 
  userName: string = '';
  appointments: any[] = [];
  displayedColumns: string[] = ['username', 'description', 'date', 'status', 'actions'];
  sortBy: string = 'date'; 
  ascending: boolean = false; 
  errorMessage: string | null = null;

  private managerService = inject(ManagerService); 

  createUser() {
    if (!this.userName.trim()) return;

    console.log('Creating user', this.userName);
    this.managerService.createUser(this.userName).subscribe({
      next: (res) => {
        alert(`${this.userName} created successfully`);
        this.userName = '';
        this.errorMessage = null;
      },
      error: (err) => this.handleError(err)
    });
  }

  loadAppointments() {
    this.managerService.getAppointments(this.sortBy, this.ascending).subscribe({
      next: (data) => (this.appointments = data),
      error: (err) => console.error('Error fetching appointments', err),
    });
  }

  approveAppointment(appointment: any) {
    this.managerService.approveAppointment(appointment.appointmentId).subscribe(() => {
      appointment.status = 1;
    });
  }

  cancelAppointment(appointment: any) {
    this.managerService.cancelAppointment(appointment.appointmentId).subscribe(() => {
      appointment.status = 2;
    });
  }

  deleteAppointment(appointment: any) {
    this.managerService.deleteAppointment(appointment.appointmentId).subscribe(() => {
      this.appointments = this.appointments.filter(a => a.appointmentId !== appointment.appointmentId);
    });
  }

  ngOnInit() {
    this.loadAppointments();
  }

  getStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Pending',
      1: 'Approved',
      2: 'Canceled'
    };
    return statusMap[status] ?? 'Unknown';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${year}/${month}/${day} - ${hours}:${minutes}`;
  }

  sortData(sort: Sort) {
    this.sortBy = sort.active;
    this.ascending = sort.direction === 'asc';
    this.loadAppointments();
  }

  handleError(error: any) {
    console.error('Error:', error);
    this.errorMessage = error.message || 'An unexpected error occurred.';
  }
}