import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { EditAppointmentDialogComponent } from '../../components/edit-appointment/edit-appointment-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-user',
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
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit { 
  constructor(private dialog: MatDialog) {}
  @ViewChild(MatSort) sort!: MatSort; 
  appointments: any[] = [];
  users: any[] = [];
  selectedUserId: number | null = null;
  displayedColumns: string[] = ['description', 'date', 'status', 'actions'];
  errorMessage: string | null = null;
  sortBy: string = 'date'; 
  ascending: boolean = false; 

  newAppointment: { description: string; date: Date | null; time: string } = {
    description: '',
    date: null,
    time: ''
  };
  
  private userService = inject(UserService); 
  
  getStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Pending',
      1: 'Approved',
      2: 'Canceled'
    };
    return statusMap[status] ?? 'Unknown';
  }

  loadAppointments(userId: number) {
    this.userService.getUserAppointments(userId, this.sortBy, this.ascending).subscribe({
      next: (data) => {
        this.appointments = data;
        this.errorMessage = null;
      },
      error: (err) => this.handleError(err)
    });
  }

  loadAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.errorMessage = null;
      },
      error: (err) => this.handleError(err),
    });    
  }

  deleteAppointment(appointment: any) {
    this.userService.deleteAppointment(appointment.appointmentId).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(a => a.appointmentId !== appointment.appointmentId);
        this.errorMessage = null;
      },
      error: (err) => this.handleError(err)
    });
  }

  onUserChange(userId: number) {
    this.selectedUserId = userId;
    this.loadAppointments(userId);
  }

  sortData(sort: Sort) {
    this.sortBy = sort.active;
    this.ascending = sort.direction === 'asc';
    if (this.selectedUserId) {
      this.loadAppointments(this.selectedUserId);
    }
  }

  saveAppointment() {
    if (!this.newAppointment.description.trim() || !this.newAppointment.date || !this.newAppointment.time || !this.selectedUserId) {
        this.errorMessage = 'Please fill in all fields correctly.';
        return;
    }
    const sanitizedDescription = this.newAppointment.description.replace(/<[^>]*>?/gm, '');
    const [hours, minutes] = this.newAppointment.time.split(':').map(Number);
    
    const fullDate = new Date(this.newAppointment.date);
    fullDate.setHours(hours, minutes, 0, 0);

    const formattedDate = `${fullDate.getFullYear()}-${(fullDate.getMonth() + 1).toString().padStart(2, '0')}-${fullDate.getDate().toString().padStart(2, '0')}T${fullDate.getHours().toString().padStart(2, '0')}:${fullDate.getMinutes().toString().padStart(2, '0')}:00`;

    const newAppt = {
        userId: this.selectedUserId,
        description: sanitizedDescription,
        date: formattedDate
    };

    this.userService.createAppointment(newAppt).subscribe({
        next: () => {
            this.newAppointment = { description: '', date: null, time: '' };
            this.loadAppointments(this.selectedUserId!);
            this.errorMessage = null;
        },
        error: (err) => this.handleError(err),
    });
}
 

  ngOnInit() {
    this.loadAllUsers();
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

  openEditDialog(appointment: any) {
    const dialogRef = this.dialog.open(EditAppointmentDialogComponent, {
      width: '400px',
      data: { appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateAppointment(result);
      }
    });
  }

  updateAppointment(updatedAppointment: any) {
    this.userService.updateAppointment(updatedAppointment).subscribe({
      next: () => {
        this.loadAppointments(this.selectedUserId!);
        this.errorMessage = null;
      },
      error: (err) => this.handleError(err)
    });
  }

  handleError(error: any) {
    console.error('Error:', error);
    this.errorMessage = error.message || 'An unexpected error occurred.';
  }
}

